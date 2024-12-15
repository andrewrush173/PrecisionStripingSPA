"use strict";

function Profile() {    
    ajax_alt(
        "session/read", // URL for AJAX call to invoke

        // Success function 
        function (obj) {  // Success function gets obj from ajax_alt

            if (obj.errorMsg != "Above data was read from the session") {
                console.log("Database error was: " + obj.errorMsg	);
                document.getElementsByClassName("profile")[0].innerHTML = "<p id=\"profile\">You are currently not logged in.</p>"
            } else {
                console.log("Data was read from the DB. See next line,");
                console.log(obj);
                document.getElementById('welcomeMsg').innerText = "Welcome, Web User " + obj.webUserId;
                document.getElementById('userEmail').innerText = "Email: " + obj.userEmail;
                document.getElementById('birthday').innerText = "Birthday: " + obj.birthday;
                document.getElementById('membershipFee').innerText = "Membership Fee: " + obj.membershipFee;
                document.getElementById('userRole').innerText = "User Role: " + obj.userRoleId, obj.userRoleType;
                document.getElementById('userImage').setAttribute("src", obj.userImage);

            }
            
        },

        // Failure function 
        function (msg) {       // Failure function gets error message from ajax_alt
            console.log("Ajax error encountered: " + msg);
            setError(msg);
        }
    );

    return(
        <div class="profile">
                
            <p id="welcomeMsg"></p>

            <p id="userEmail"></p>

            <p id="birthday"></p>

            <p id="membershipFee"></p>

            <p id="userRole"></p>

            <img id="userImage"></img>

        </div>
    );
}