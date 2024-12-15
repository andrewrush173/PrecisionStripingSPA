"use strict"; // not sure if this is needed in react...

const JobInsertOrUpdate = (props) => {

    // See if this is an Insert or an Updat by checking the path that invoked this component.
    // If the path has a : in it, then its update, else its insert.
    // If update, extract (from the path) the id of the webUser record that is to be updated. 
    // console.log("props for jobInsertOrUpdate on next line");
    // console.log(props);

    var action = "insert"; // exact spelling has to match web API @RequestMapping
    var id = "";
    var url = props.location.pathname;
    console.log("url that invoked JobInsertOrUpdate is " + url);
    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    // Set initial values of state variables and receive (from React) a setter function for each one.
    // In React, you create State Variables for anything that (if changed) needs to re-render the UI. 

    // Object (State Variable) that holds all the user entered data. Each object 
    // is linked with a textbox for user input. 
    const [jobData, setJobData] = React.useState(
        {
            "jobsId": "",
            "serviceType": "",
            "jobDay": "",
            "totalCost": "",
            "imageUrl": "",
            "webUserId": "",
            "errorMsg": ""
        }
    );

    // State variable to hold the Web User List 
    // Web User List populates the <select tag> for the UI.
    const [webUserList, setWebUserList] = React.useState([]);

    // Object (State Variable) that holds all the error messages - field level 
    // and form/record level (errorMsg).
    const [errorObj, setErrorObj] = React.useState(
        {
            "jobsId": "",
            "serviceType": "",
            "jobDay": "",
            "totalCost": "",
            "imageUrl": "",
            "webUserId": "",
            "errorMsg": ""
        }
    );

    // We have three possible ajax calls and we want to track each one independently
    // to know if they are in progress or done. If anything is in progress, we 
    // just put up a "...Loading..." UI to avoid complications trying to render 
    // something that's not ready yet. 

    // The first ajax call gets the Role list so we can build a role <select> tag. 
    const [isLoadingWebUserList, setIsLoadingWebUserList] = React.useState(true);

    // Then, if it's update (not insert), we need an ajax call to read the user 
    // record to prepopulate the Data Entry UI. 
    const [isLoadingJob, setIsLoadingJob] = React.useState(true);

    // We do the above two ajax calls (user and role list) in parallel and track
    // each one's completion using it's own boolean. 
 
    // This boolean tracks whether or not we have invoked the insert/update save 
    // Web API (and are awaiting its result).   
    const [isLoadingSaveResponse, setIsLoadingSaveResponse] = React.useState(false);

    const encodeJobInput = () => {
        console.log("encoding Job input, jobsId id is " + jobData.jobsId);
        var jobInputObj = {
            "jobsId": jobData.jobsId,
            "serviceType": jobData.serviceType,
            "jobDay": jobData.jobDay,
            "totalCost": jobData.totalCost,
            "imageUrl": jobData.imageUrl,
            "webUserId": jobData.webUserId
        };
        console.log("jobInputObj on next line");
        console.log(jobInputObj);
        // turn the job input object into JSON then run that through 
        // a URI encoder (needed for security on server side, prevents 
        // server from hacks). 
        //return encodeURIComponent(JSON.stringify(jobInputObj));
        return encodeURI(JSON.stringify(jobInputObj));
    };

    // If you just change the value of a State object's property, then React does not 
    // know that the object has been changed (and thus does re-render the UI). 
    // To get around this, I wrote function setProp that clones the object, changes 
    // the desired property, then returns the clone. THEN React knows that the object 
    // has been changed (and re-renders the UI). 
    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj); // makes a copy of the object
        o[propName] = propValue; // changes the property of the copy
        // console.log("setProp orig object is");
        // console.log(obj);
        // console.log("after changing " + propName + " to " + propValue + " the new obj is");
        // console.log(o);
        return o; // returns the object copy with the property's value changed.
    };

    // useEffect second parameter is an array of "watch elements" that 
    // (if they change) should trigger the function specified 
    // as the first useEffect parameter.

    // This code should execute just once at initial page render because 
    // the array of watch elements (second parameter to useEffect) is empty.
    React.useEffect(() => {

        console.log("AJAX call for web user list");
        ajax_alt("webUser/getAll",

            function (obj) { // success function. obj holds role list from AJAX call

                if (obj.dbError.length > 0) {  // db error trying to read role list
                    //setProp = (obj, propName, propValue)
                    setErrorObj(setProp(errorObj, "webUserId", obj.dbError));
                    //setRoleError(obj.dbError);
                } else {
                    obj.webUserList.sort(function (a, b) {
                        if (a.userEmail > b.userEmail) {
                            return 1
                        } else {
                            return -1;
                        }
                        return 0;
                    });
                    console.log('Sorted user email list on next line');
                    console.log(obj.webUserList);
                    setWebUserList(obj.webUserList);
                }
                setIsLoadingWebUserList(false);
            },
            function (msg) { // Failur function. msg is AJAX Error Msg.
                // setRoleError(msg);
                setErrorObj(setProp(errorObj, "errorMsg", msg));
                setIsLoadingWebUserList(false);
            }
        );

        if (action === "update") { //this is update, not insert, get job by the id
            console.log("Now getting job record " + id + " for the update");
            ajax_alt("jobs/getById?jobsId=" + id,
                function (obj) {
                    if (obj.errorMsg.length > 0) { // obj.errorMsg holds error, e.g., db error
                        console.log("DB error trying to get the webUser record for udpate");
                        setErrorObj(setProp(errorObj, "errorMsg", obj.errorMsg));
                        //setProp = (obj, propName, propValue)
                    } else { // obj holds the webUser record of the given id
                        console.log("got the web user record for update (on next line)");
                        console.log(obj);
                        setJobData(obj); // prepopulate user data since this is update.
                    }
                    setIsLoadingJob(false);
                },
                function (msg) { // AJAX Error Msg from trying to read the webUser to be updated.
                    setErrorObj(setProp(errorObj, "errorMsg", msg));
                    setIsLoadingJob(false);
                }
            );
        } else {
            setIsLoadingJob(false); // for insert, we do not have to pre-load the user
        }
    }, []);

    const validate = () => {
        setIsLoadingSaveResponse(true);
        // In this function, we just change the value of state variable submitCount 
        // so that the React.useEffect (that's watching for changes in submitCount)
        // will run, making the AJAX call.  
        console.log("Validate, should kick off AJAX call");
        // action was set to insert or update above (must match web API @RequestMapping). 
        ajax_alt("jobs/" + action + "?jsonData=" + encodeJobInput(),

            function (obj) { // obj holds field level error messages
                console.log("These are the error messages (next line)");
                console.log(obj);

                if (obj.errorMsg.length === 0) {
                    // errorMsg = "" means no error, record was inserted (or updated). 
                    obj.errorMsg = "Record Saved !";
                }

                setErrorObj(obj); // show the field level error messages (will all be "" if record was inserted)
                setIsLoadingSaveResponse(false);
            },
            function (msg) { // AJAX error msg trying to call the insert or update API
                setFormMsg(msg);
                setIsLoadingSaveResponse(false);
            }
        );
    };

    if (isLoadingWebUserList || isLoadingJob || isLoadingSaveResponse) {
        return <div>... Loading ... </div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Job ID</td>
                    <td>
                        <input value={jobData.jobsId} disabled/>
                    </td>
                    <td className="error">
                        {errorObj.jobsId}
                    </td>
                </tr>
                <tr>
                    <td>Service Type</td>
                    <td>
                        <input value={jobData.serviceType} onChange=
                            {e => setJobData(setProp(jobData, "serviceType", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.serviceType}
                    </td>
                </tr>
                <tr>
                    <td>Job Date</td>
                    <td>
                        <input value={jobData.jobDay} onChange=
                            {e => setJobData(setProp(jobData, "jobDay", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.jobDay}
                    </td>
                </tr>
                <tr>
                    <td>Total Cost</td>
                    <td>
                        <input value={jobData.totalCost} onChange=
                            {e => setJobData(setProp(jobData, "totalCost", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.totalCost}
                    </td>
                </tr>
                <tr>
                    <td>Image URL</td>
                    <td>
                        <input value={jobData.imageUrl} onChange=
                            {e => setJobData(setProp(jobData, "imageUrl", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.imageUrl}
                    </td>
                </tr>
                <tr>
                    <td>Manager</td>
                    <td>
                    <select onChange=
                            {e => setJobData(setProp(jobData, "webUserId", e.target.value))}
                            value={jobData.webUserId}>
                            <option value ="" disabled>-</option>
                        {
                            webUserList.map(webUser =>
                                <option key={webUser.webUserId} value={webUser.webUserId}>
                                    {webUser.userEmail}
                                </option>
                            )
                        }
                        </select>
                    </td>
                    <td className="error">
                        {errorObj.webUserId}
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <button type="button" onClick={validate}>Save</button>
                    </td>
                    <td className="error" colSpan="2">
                        <br />
                        {errorObj.errorMsg}
                    </td>
                </tr>
            </tbody>
        </table>

    ); // ends the return statement

}; // end of function/component
