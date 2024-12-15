package com.sample;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import dbUtils.*;
import model.jobs.*;
import view.JobsView;

@RestController
public class JobsController {  

    @RequestMapping(value = "/jobs/getAll", produces = "application/json")  
    public String allJobs() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = JobsView.getAllJobs(dbc);  

        dbc.close(); 
        return Json.toJson(list); // Convert the list to JSON and return it
    }

    @RequestMapping(value = "/jobs/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No job data was provided in JSON format";
        } else {
            System.out.println("job data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("job data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.jobs.StringData obj: "+
                jsonInsertData+ " - or other error in controller for 'jobs/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/jobs/getById", params = { "jobsId" }, produces = "application/json")
    public String getById(@RequestParam("jobsId") String jobsId) {
        StringData sd = new StringData();
        if (jobsId == null) {
        sd.errorMsg = "Error: URL must be jobs/getById/xx " +
                "where xx is the jobs_id of the desired jobs record.";
        } else {
        DbConn dbc = new DbConn();
        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() == 0) {
            System.out.println("*** Ready to call DbMods.getById");
            sd = DbMods.getById(dbc, jobsId);
        }
        dbc.close(); // EVERY code path that opens a db connection must close it
        // (or else you have a database connection leak).
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/jobs/update", params = { "jsonData" }, produces = "application/json") 
    public String update(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorData = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No user data was provided in JSON format";
        } else {
            System.out.println("user data for update: (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for update (java obj): " + updateData.toString());

                // The next 3 statements handle their own exceptions (so should not throw any
                // exception).
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'webUser/insert'..." + 
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }
        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/jobs/delete", params = {
        "jobId" }, produces = "application/json")
    public String delete(@RequestParam("jobId") String deleteJobId) {
    StringData sd = new StringData();
    if (deleteJobId == null) {
        sd.errorMsg = "Error: URL must be user/getById?jobId=xx, where " +
                "xx is the jobs_id of the jobs record to be deleted.";
    } else {
        DbConn dbc = new DbConn();
        sd = DbMods.delete(dbc, deleteJobId);
        dbc.close();
    }
    return Json.toJson(sd);
}
    
}
