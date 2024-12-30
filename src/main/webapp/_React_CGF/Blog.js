"use strict";
function Blog() {
    return (
        <div id="blog-content">
           <h1>Blog</h1>

            <h2>Home Page</h2>
            <p>
            In designing the HTML structure and CSS styling for this web application, I implemented several practices to ensure a functional and visually appealing page layout. The HTML structure incorporates elements with id attributes for organization, such as id="title" for the website's title, id="nav" for a navigation bar, id="content" for the main content area, and id="footer" for a footer displaying the author's name. The title text is prominently styled to stand out on the page, complemented by a title tag in the head section for proper browser tab identification. To enhance usability, the title and navigation areas are fixed, ensuring they remain visible during scrolling, with responsive styling that adjusts their arrangement based on the viewport width. The footer is also fixed and positioned to avoid overlapping with the content area.
            </p>
            <p>
            For visual appeal, I developed a professional color scheme by selecting hues directly from an image on the page; ensuring natural harmony with the content. The CSS adheres to a fluid layout principle, utilizing percentage widths and box-sizing: border-box to avoid horizontal scroll bars and optimize the use of screen space across all viewport sizes. To maintain readability, CSS rules like white-space: nowrap were applied to prevent the title text from wrapping, while all text, including links, were styled with appropriate contrast and padding to avoid overcrowding. Navigation links were customized to exclude underlines and differentiated from other content links using compound CSS selectors. Overall, the design ensures usability, accessibility, and adaptability for various devices and screen sizes.
            </p>
            
            <h2>Account Menu</h2>
            <p>
            The Account dropdown menu in this application provides several user functionalities: Register, Log In, Log out, and Profile. These options implement full logon and logoff capabilities, as well as a profile view accessible only to logged-on users.
            </p>

            <p>
            The Register option allows new users to create an account by entering their details, which are validated and then sent to the server via a dedicated API. Upon successful registration, the user is added to the database, and a confirmation message is displayed. This functionality ensures that only valid user information is stored.
            </p>

            <p>
            The Log In functionality prompts users to enter their credentials and invokes a server-side Logon API. Upon successful login, the application retrieves the user's information from the database, including an image, and stores the fully populated user record in the server-side session object. The UI dynamically displays a "welcome" message with the user's details. In case of invalid credentials, an error message is shown e.g., AJAX error, database error, or user not found, and the session object is invalidated.
            </p>

            <p>
            The Log Out option invalidates the server-side session object without accessing the database and displays a confirmation message or an AJAX error message if the operation fails. Like the Profile functionality, the Log Out UI also uses an initial AJAX call to display the appropriate message without requiring user interaction.
            </p>

            <p>
            The Profile option retrieves user information directly from the server-side session object, bypassing the database. If a user is logged in, the profile displays their information in a UI similar to the logon "welcome" screen, ensuring code reuse between the logon and profile interfaces. If no user is logged in, the profile displays an error message such as "Cannot show profile -- no user logged in." The Profile UI automatically retrieves the user's data via an initial AJAX call, eliminating the need for a button click to initiate the request.
            </p>

            <h2>JS Content</h2>
            <p>
            The JS Content section incorporated into this web application focuses on modularity and reusability through the use of a "Make function" and a supporting content generating function. The make function leverages JavaScript templating to dynamically create components based on properties that align with the data model of the "jobs" database table. By accepting input parameters, the make function allows multiple components with varying properties to be generated as needed.  
            </p>
            <p>
            To style the components exclusively, a dedicated CSS file was created, isolating the visual design for this specific functionality. The content generating function, designed without input parameters, invokes the make function multiple times to generate a set of components. This CGF is linked to the navigation bar via react router, enabling users to access the output by clicking a corresponding link.
            </p>

            <h2>Search Menu</h2>
            <p>
            The search dropdown menu allows users to view and manage data from the web_user and jobs tables. Upon selecting an option, the application displays neatly formatted HTML tables that are populated with records dynamically retrieved from the database using server-side APIs. These tables provide an interface for viewing user and job data, including details such as user roles and job-specific attributes. Additionally, the tables incorporate interactive components for adding, editing, and deleting records, ensuring comprehensive data manipulation capabilities. By leveraging AJAX calls and React components, these functionalities are incorporated into the UI, offering an efficient experience for managing the application's database.
            </p>

            <h2>Database Tables</h2>
            <p>
            In my design of the database tables for this application, two key tables were created in MySQL Workbench: one for tracking site users and another for tracking "jobs" associated with specific users. The "jobs" table incorporates several considerations to ensure functionality, scalability, and data integrity.
            </p>
            <p>
            The primary key of the jobs table is an auto-incrementing field named jobs_id, following the convention of appending _id to the table name for clarity. A unique character identifier field is included to ensure distinct identification of each job, marked with a unique constraint UQ. Additionally, the table includes a field for an image URL image_url, designed as a VARCHAR 200 to accommodate fully qualified URLs.
            </p>
            <p>
            To provide flexibility and allow for diverse job attributes, the table includes at least two nullable non-character fields, such as job_cost,va decimal field for monetary values, and job_date, a date field for scheduling or tracking purposes. These fields are optional, enabling users to skip them if not relevant to a specific job entry. The table also includes 1-3 additional fields for customized data, allowing the application to adapt to future requirements or features.
            </p>
            <p>
            To establish relationships between tables, the web_user_id field serves as a foreign key, linking each job record to a specific user in the users table. This field is marked as non-nullable NN, ensuring that every job is associated with a valid user. Care was taken to avoid using SQL reserved keywords for table and field names, preventing potential conflicts with SQL commands and ensuring smooth integration with the Java application.
            </p>


            <h2>Web APIs</h2>
            <p>
            The server-side Web APIs for this application, implemented using Java Spring Boot, give comprehensive data management capabilities. The listUser Web API was designed to retrieve web_user data joined with the user_role table from the database. Additionally, a custom Web API was developed to extract data from the "jobs" table, joined with the web_user table, enabling the display of job-specific details alongside user information.
            </p>
            <p>
            To enhance usability, these APIs are integrated with the application's front end, allowing users to view the database tables via the "Search" dropdown menu. Selecting an option from this menu displays neatly formatted HTML tables for web_user and jobs, populated with records extracted from the database. These tables include interactive components for editing, deleting, and adding records, providing an interface for managing data directly within the application.
            </p>

            <p>
            In addition, a custom Web API was designed to retrieve data from the jobs database table, and join it with the web_user table. This API enables the application to display contextualized information about the jobs, such as the user who created each record, alongside additional details specific to the jobs table. Both APIs manage routing, handle requests, and return results in JSON format, making the data easily consumable by the React front end.
            </p>

            <p>
            If you would like to see my <strong>List Users API</strong> open up in a new tab,
            click <a href="webUser/getAll" target="_blank">here</a>.
            </p>

            <p>
            If you would like to see my <strong>List Jobs API</strong> open up in a new tab,
            click <a href="jobs/getAll" target="_blank">here</a>. 
            </p>

        </div>
    );
}