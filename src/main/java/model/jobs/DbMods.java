package model.jobs;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;

public class DbMods {
    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        errorMsgs.jobsId = Validate.integerMsg(inputData.jobsId, false);
        errorMsgs.serviceType = Validate.stringMsg(inputData.serviceType, 100, true);
        errorMsgs.jobDay = Validate.dateMsg(inputData.jobDay, false);
        errorMsgs.totalCost = Validate.decimalMsg(inputData.totalCost, false);
        errorMsgs.imageUrl = Validate.stringMsg(inputData.imageUrl, 200, false);
        errorMsgs.webUserId = Validate.integerMsg(inputData.webUserId, true);


        return errorMsgs;
    } // validate

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
             * String sql =
             * "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
             * "web_user.user_role_id, user_role_type "+
             * "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id "
             * +
             * "ORDER BY web_user_id ";
             */
            // Start preparing SQL statement
            String sql = "INSERT INTO jobs (service_type, job_day, total_cost, " + 
             "image_url, web_user_id) values (?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.serviceType);
            pStatement.setDate(2, Validate.convertDate(inputData.jobDay));
            pStatement.setBigDecimal(3, Validate.convertDecimal(inputData.totalCost));
            pStatement.setString(4, inputData.imageUrl);
            pStatement.setInt(5, Validate.convertInteger(inputData.webUserId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Job ID - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That image URL is already in use - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        // For update, we also need to check that webUserId has been supplied by the user...
        errorMsgs.webUserId = Validate.integerMsg(updateData.webUserId, true);

        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            String sql = "UPDATE jobs SET service_type = ?, job_day = ?, total_cost = ?, " 
            + "image_url = ?, web_user_id = ? WHERE jobs_id = ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, updateData.serviceType); // string type is simple
            pStatement.setDate(2, Validate.convertDate(updateData.jobDay));
            pStatement.setBigDecimal(3, Validate.convertDecimal(updateData.totalCost));
            pStatement.setString(4, updateData.imageUrl);
            pStatement.setInt(5, Validate.convertInteger(updateData.webUserId));
            pStatement.setInt(6, Validate.convertInteger(updateData.jobsId)); 

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update OR the web User id (supplied by the client side) does not exist.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid User Role Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That image URL is already being used elsewhere - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("cannot be null")) {
                errorMsgs.errorMsg = "Please enter an integer - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        // This case already tested in the controller, but ("belt and suspenders")
        // we are double checking here as well.
        if (id == null) {
            sd.errorMsg = "Cannot getById (job): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (job): URL parameter 'id' can't be converted to an Integer.";
            return sd;
        }
        try {
            String sql = "SELECT jobs_id, service_type, job_day, total_cost, web_user_id, image_url "
                    + "FROM jobs "
                    + "WHERE jobs_id = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the
            // the first (and only) ?
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set

                // plainInteger returns integer converted to string with no commas.
                sd.jobsId = Format.fmtInteger(results.getObject("jobs_id"));
                sd.serviceType = Format.fmtString(results.getObject("service_type"));
                sd.jobDay = Format.fmtDate(results.getObject("job_day"));
                sd.totalCost = Format.fmtDollar(results.getObject("total_cost"));
                sd.imageUrl= Format.fmtString(results.getObject("image_url"));
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));

            } else {
                sd.errorMsg = "Job Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.jobs.DbMods.getById(): " + e.getMessage();
        }
        return sd;
    } // getById

    public static StringData delete(DbConn dbc, String jobId) {
        StringData sd = new StringData();

        if (jobId == null) {
            sd.errorMsg = "modeluserId.DbMods.delete: " +
                    "cannot delete job record because 'jobId' is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) { // cannot proceed, db error
            return sd;
        }

        try {
            String sql = "DELETE FROM jobs WHERE jobs_id = ?";

            // Compile the SQL (checking for syntax errors against connected DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement
            pStatement.setString(1, jobId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                sd.errorMsg = "Record not deleted - there was no record with jobs_id " + jobId;
            } else if (numRowsDeleted > 1) {
                sd.errorMsg = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage(); 
        }

        return sd;
    } // delete
}
