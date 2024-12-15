"use strict";
function Login() { 
    const [IsLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [profile, setProfile] = React.useState(<div></div>)

    var password = "";
    var email = "";

    const UserLogin = () => {
        setIsLoading(true);

        email = document.getElementById('email').value;
        password = document.getElementById('password').value;

        ajax_alt(
            "session/Login?email=" + email + "&password=" + password, // URL for AJAX call to invoke

            // Success function 
            function (obj) {   // Success function gets obj from ajax_alt
                if (obj.errorMsg.length > 0) {
                    console.log("Database error was " + obj.errorMsg	);
                    setError(obj.errorMsg);
                    setProfile(<p>Invalid Email and/or Password</p>)
                } else {
                    setProfile(Profile());
                }
                setIsLoading(false); // allow the component to be rendered
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                console.log("Ajax error encountered: " + msg);
                setError(msg);

                setIsLoading(false);
            }
        );
        
    }
   
    if (IsLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="login">
        <h2>Log In</h2>
        <div className="input-container">
            <div className="field">
                <p className="child">Email:</p>
                <input className="child" id="email" />
            </div>
            <div className="field">
                <p className="child">Password:</p>
                <input className="child" id="password" type="password" />
            </div>
        </div>
        <button className="submit-button" type="button" onClick={() => UserLogin()}>Enter</button>
        {profile}
    </div>
    );
}