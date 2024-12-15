package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;
import model.jobs.*;


public class JobsView {

    public static StringDataList getAllJobs(DbConn dbc) {

        // sdl will be an empty array and dbError with "" 
        StringDataList sdl = new StringDataList(); 

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }
        
        // sd will have all of its fields initialized to ""
        StringData sd = new StringData();
        
        try {
            String sql = "SELECT jobs_id, service_type, job_day, total_cost, jobs.web_user_id, image_url, user_email "// , user_email, user_image
                       + "FROM jobs, web_user WHERE jobs.web_user_id = web_user.web_user_id ORDER BY jobs_id ";  // always order by something, not just random order.
                       // FROM jobs, web_user WHERE jobs.web_user_id = web_user.web_user_id
            
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {
                
                sd = new StringData();
                
                // Using the Format methods to handle formatting and error handling for the data
                sd.jobsId = Format.fmtInteger(results.getObject("jobs_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.serviceType = Format.fmtString(results.getObject("service_type"));
                sd.jobDay = Format.fmtDate(results.getObject("job_day"));
                sd.totalCost = Format.fmtDollar(results.getObject("total_cost"));
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.imageUrl = Format.fmtString(results.getObject("image_url"));
                
                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in JobsView.getAllJobs(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}
