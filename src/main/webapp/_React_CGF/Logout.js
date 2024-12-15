"use strict";

function Logout() {  
    const [logoutState, setLogoutState] = React.useState(<p>Logging out...</p>)  
    ajax_alt(
        "session/logout", // URL for AJAX call to invoke

        // Success function 
        function (obj) {   // Success function gets obj from ajax_alt
            if (obj.errorMsg != "Session has been invalidated") {
                console.log("Database error was " + obj.errorMsg	);
                setLogoutState(<p>Error Logging Out</p>)
            } else {
                console.log("Data was read from the DB. See next line,");
                console.log(obj);
                setLogoutState(<p>Logged Out Successfully</p>)
            }
            
        },

        // Failure function 
        function (msg) {       // Failure function gets error message from ajax_alt
            console.log("Ajax error encountered: " + msg);
            setError(msg);
        }
    );

    return(
        <div class="logout">
                
            <p>{logoutState}</p>

        </div>
    );
}