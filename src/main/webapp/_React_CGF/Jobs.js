"use strict";

const Jobs = () => {

    // Common React pattern. Display a "...Loading..." UI (don't try to render)
    // until ajax call is complete.  
    const [isLoading, setIsLoading] = React.useState(true);

    // this is data read (just once) from the DB.
    const [dbList, setDbList] = React.useState([]);

    // if there is an  error (ajax or database), set this state variable
    // and show the error message in the UI.
    const [error, setError] = React.useState(null);

    const [items, setItems] = React.useState([]);

    // the user's input that filters the list. 
    const [filterInput, setFilterInput] = React.useState("");

    // this is the filtered list.
    const [filteredList, setFilteredList] = React.useState([]);

    console.log("Jobs table running!!");

    // useEffect takes two params. The first param is the function to be run. 
    // The second param is a list of state variables that (if they change) will 
    // cause the function (first param) to be run again.
    // RUN ONCE PATTERN: With [] as 2nd param, it runs the 1st param (fn) just once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(

            "jobs/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    console.log(dbList.jobsList);
                    setDbList(dbList.jobsList);
                    setFilteredList(dbList.jobsList);
                }
                setIsLoading(false);
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError(msg);
                setIsLoading(false);
            }
        );
    }, []);

    function sortByProp(propName, sortType) {
        // sort the user list based on property name and type
        jsSort(filteredList, propName, sortType);
        console.log("Sorted list is below");
        console.log(dbList);

        // For state variables that are objects or arrays, you have to do 
        // something like this or else React does not think that the state 
        // variable (dbList) has changed. Therefore, React will not re-render 
        // the component.
        let listCopy = JSON.parse(JSON.stringify(dbList)); 
        setDbList(listCopy);
    }

    const doFilter = (filterInputVal) => {
        let newList = filterObjList(dbList, filterInputVal);
        console.log("function doFilter. filterInputVal is: " + filterInputVal +
            ". See filtered list on next line:");
        console.log(newList);
        setFilteredList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        doFilter("");
    }

    function callInsert() {
        window.location.hash = "#/JobInsert";
    }

    function deleteListEle(theList, indx) {
        // This javaScript "built in function" removes 1 element (2nd param),
        // starting from position indx (1st param)
        theList.splice(indx,1);

        // You have to make React aware that the list has actually changed 
        // or else it won't re-render. Converting to JSON and back does the trick.
        return JSON.parse(JSON.stringify(theList));
    }

    function deleteJob(jobObj, indx) {
        console.log("To delete job " + jobObj.jobsId + "?");

        if (confirm("Do you really want to delete Job " + jobObj.jobsId + "?")) {

            ajax_alt(
                "jobs/delete?jobId=" + jobObj.jobsId,
                function (response) { // Success 
                    console.log("API Response:", response);
    
                    // Check if the API returned an error message
                    if (response.errorMsg && response.errorMsg.length > 0) {
                        alert("Error: " + response.errorMsg); 
                    } else {
                        alert("Job successfully deleted.");
                        const updatedItems = deleteListEle(items, indx); 
                        const updatedFilteredList = deleteListEle(filteredList, indx); 

                        setItems(updatedItems); // Update main state
                        setFilteredList(updatedFilteredList); // Updating filtered state
                    }
                },
                function (errorObj) { // Failure
                    console.error("API Call Failed:", errorObj); 
                    alert("Failed to delete the user. Please try again.");
                }
            );
        }
    } // deleteUser

    if (isLoading) {
        console.log("initial rendering, Data not ready yet...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log(`there must have been an ajax error (e.g., bad URL), 
        or database error (e.g., connection error because not tunnelled in)...`);
        return <div>Error: {error} </div>;
    } 

    console.log("Rendering sorted UserTable. sorted list is on next line...");
    console.log(dbList);

    // NOTE: onClick in React has a capital C, unlike the regular JS onclick.
    return (
        <div className="clickSort">
            <h3>Sortable/Filterable Jobs List &nbsp;
            <img src="icons/insert.png" onClick={callInsert}/>
            <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp; 
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp; 
                <button onClick={clearFilter}>Clear</button>
            </h3>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th onClick={() => sortByProp("jobsId", "number")} 
                            className="textAlignRight">
                            <img src="icons/sortUpDown16.png" /> Job ID
                        </th>
                        <th onClick={() => sortByProp("userEmail", "text")} >
                            <img src="icons/blackSort.png" /> Manager
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th onClick={() => sortByProp("serviceType", "text")}
                            className="textAlignCenter">
                            <img src="icons/blackSort.png" />Service
                        </th>
                        <th onClick={() => sortByProp("totalCost", "number")}
                            className="textAlignRight">
                            <img src="icons/whiteSort.png" />Cost
                        </th>
                        <th onClick={() => sortByProp("jobDay", "date")}>
                            <img src="icons/sortUpDown16.png" />Day
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredList.map((listObj, index) =>
                            <tr key={listObj.jobsId}>
                                <td className="textAlignCenter" onClick={() => deleteJob(listObj, index)}  >
                                    <img src="icons/delete.png" />
                                </td>
                                <td>
                                    <a href={'#/jobUpdate/:'+listObj.jobsId}><img src="icons/update.png" className="clickLink"/></a>
                                </td>
                                <td className="simple textAlignRight">{listObj.jobsId}</td>
                                <td className="simple textAlignCenter">{listObj.userEmail}</td>
                                <td className="simple textAlignCenter"><img src={listObj.imageUrl} /></td>
                                <td>{listObj.serviceType}</td>
                                <td className="textAlignRight">{listObj.totalCost}</td>
                                <td className="textAlignCenter">{listObj.jobDay}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};