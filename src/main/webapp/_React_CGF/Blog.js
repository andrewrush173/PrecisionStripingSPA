"use strict";
function Blog() {
    return (
        <div id="blog-content">
           <h1>Blog</h1>

            <h2>Server Page</h2>
            <p>
            Visit my server-side page: <a href="hello" target="_blank">here</a>.
            </p>

            <h2>Database Design</h2>
            <p>
            The proposed database table will store information about the jobs we complete for our customers.
            This table will support our website by tracking the details of each job, allowing us to keep records of
            the services provided, the dates of the jobs, and the total cost charged to the customer.
            </p>

            <ul>
            <li><strong>job_id</strong> (integer) - A unique identifier for each job.</li>
            <li><strong>service_type</strong> (varchar) - The type of service provided (e.g., striping, epoxy coating).</li>
            <li><strong>job_date</strong> (date) - The date when the job was completed. (Non-character field)</li>
            <li><strong>total_cost</strong> (decimal) - The total cost of the job. (Non-character field)</li>
            </ul>

            <p>
                Click <a target="_blank" href='docs/Rush_databaseHW.pdf'>here</a> to see my database document. 
            </p>

            <h2>My Database Experience</h2>
            <p>
            I currently do not have any experience working with databases, however I'm excited to learn about database design and management through this course.
            </p>

            <h2>My Web Development Experience</h2>
            <p>
            I don't have much web development experience to speak of, although I have some surface knowledge. This is another area that I look forward to learning about in this course.
            </p>

            <h2>HW 1 Home Page</h2>
            <p>
            In this module I found it relatively easy to work with HTML and structure the layout of the page. However, understanding how to style the page using CSS, especially managing spacing and layout adjustments, was a bit challenging at first.
            </p>

            <h2> HW 2 Database</h2>
            <p>
            Before enrolling in 3308, I had no prior experience working with databases. However, I have been learning the beginner concepts effectively and I feel that I've been gaining a solid understanding of how databases work. This has given me confidence to  apply these new skills to future projects.
            </p>

            <p>
            The database homework assignment helped reinforce important database concepts even further; it strengthened my understanding of how databases work. I didn't encounter much difficulty overall, but certain aspects were slightly tedious, particularly when it came to setting up the foreign key correctly and ensuring that no errors were generated when I ran specific SQL statements.
            </p>

            <h2>HW 3 SPA Application</h2>
            <p>
            In this module I found it relatively easy to design the single page application, there were some more technically challenging tasks to be done here but overall I didn't encounter much difficuty with this module. 
            </p>

            <h2>HW 4 JS Components</h2>
            <p>
            In this module I found it challenging to make the various reusable and content generating functions work in conjunction with eachother. Although designing the styling and layout of the components wasn't as difficult.  
            </p>

            <h2>HW 5 Web API</h2>
            <p>
            In this homework I found it challenging to manage database access and deal with errors. I also developed an API to retrieve user data from a MySQL database. Overall, I anticipate I will have to review the content explored in this module. 
            </p>

            <p>
            If you would like to see my <strong>List Users API</strong> open up in a new tab,
            click <a href="webUser/getAll" target="_blank">here</a>.
            </p>

            <p>
            If you would like to see my <strong>List Jobs API</strong> open up in a new tab,
            click <a href="jobs/getAll" target="_blank">here</a>. 
            </p>

            <p>
            If you would like to see my <strong>Web API Error Message Document</strong> open up in a new tab,
            click <a href='docs/WebAPIErrors.pdf' target="_blank">here</a>. 
            </p>

            <h2>HW 6 ShowData</h2>
            <p>
            This homework was relatively easy I felt, the most tedious part was getting the format of the HTML tables correct, specifically getting the images to render correctly. Other than that, I felt that this homework assignment was pretty straightforward.
            </p>

            <h2>HW 7 Logon</h2>
            <p>
            This homework was more challenging than previous ones I thought, getting my Login and Profile React functions to behave properly took some time. Although it certainly provided more insight as to how AJAX calls behave within the browser. 
            </p>

            <h2>HW 8 Insert</h2>
            <p>
            This homework didn't feel too difficult, it was helpful to take care of things in the lab activity before trying to incorporate the HW sample code into my project. Making the UI for my jobs insert page was probably the most tedious part, but it was still straightforward.
            </p>
            
            <h2>HW 9 Update</h2>
            <p>
            This homework wasn't too hard, although it took me awhile since I went back to to fix some things based on deductions for my insert HW. Getting my other table to properly display an inserted record is what felt the most challenging, updating a record in this table also took me some time.
            </p>

            <h2>HW 10 Delete</h2>
            <p>
            This homework was fairly easy, as there wasn't a ton of new things to implement in my project. I'd say the most challenging part was getting the UI to reflect a record having been deleted without refreshing the page, but that still didn't take me too long. 
            </p>
        </div>
    );
}