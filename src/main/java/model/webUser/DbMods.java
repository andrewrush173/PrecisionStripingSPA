package model.webUser;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;

public class DbMods {
    
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        errorMsgs.userEmail = Validate.stringMsg(inputData.userEmail, 45, true);
        errorMsgs.userPassword = Validate.stringMsg(inputData.userPassword, 45, true);

        if (inputData.userPassword.compareTo(inputData.userPassword2) != 0) { // case sensative comparison
            errorMsgs.userPassword2 = "Both passwords must match";
        }

        errorMsgs.userImage = Validate.stringMsg(inputData.userImage, 300, false);

        errorMsgs.birthday = Validate.dateMsg(inputData.birthday, false);
        errorMsgs.membershipFee = Validate.decimalMsg(inputData.membershipFee, false);
        errorMsgs.userRoleId = Validate.integerMsg(inputData.userRoleId, true);

        return errorMsgs;
    } // validate

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            String sql = "INSERT INTO web_user (user_email, user_password, user_image, membership_fee, birthday, " +
                    "user_role_id) values (?,?,?,?,?,?)";
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.userEmail); // string type is simple
            pStatement.setString(2, inputData.userPassword);
            pStatement.setString(3, inputData.userImage);
            pStatement.setBigDecimal(4, Validate.convertDecimal(inputData.membershipFee));
            pStatement.setDate(5, Validate.convertDate(inputData.birthday));
            pStatement.setInt(6, Validate.convertInteger(inputData.userRoleId));

            // SQL statement executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid User Role Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken - " + errorMsgs.errorMsg;
            } 

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        // For update, we also need to check that webUserId has been supplied by the user...
        errorMsgs.webUserId = Validate.integerMsg(updateData.webUserId, true);

        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation
            String sql = "UPDATE web_user SET user_email = ?, user_password = ?, user_image = ?, "+
            "membership_fee = ?, birthday = ?, user_role_id = ? WHERE web_user_id = ?";
            
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setString(1, updateData.userEmail); 
            pStatement.setString(2, updateData.userPassword);
            pStatement.setString(3, updateData.userImage);
            pStatement.setBigDecimal(4, Validate.convertDecimal(updateData.membershipFee));
            pStatement.setDate(5, Validate.convertDate(updateData.birthday));
            pStatement.setInt(6, Validate.convertInteger(updateData.userRoleId));
            pStatement.setInt(7, Validate.convertInteger(updateData.webUserId));

            // SQL statement is executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // Success
                } else {
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid User Role ID - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not an empty string.
        return errorMsgs;
    } // update

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        
        if (id == null) {
            sd.errorMsg = "Cannot getById (user): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (user): URL parameter 'id' can't be converted to an Integer.";
            return sd;
        }
        try {
            String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "
                    + "user_image, web_user.user_role_id, user_role_type "
                    + "FROM web_user, user_role WHERE web_user.user_role_id = user_role.user_role_id "
                    + "AND web_user_id = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the
            // the first (and only) ?
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set

                // plainInteger returns integer converted to string with no commas
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userPassword = Format.fmtString(results.getObject("user_password"));
                sd.userPassword2 = Format.fmtString(results.getObject("user_password"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));
                sd.birthday = Format.fmtDate(results.getObject("birthday"));
                sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
                sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));

            } else {
                sd.errorMsg = "Web User Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.webUser.DbMods.getById(): " + e.getMessage();
        }
        return sd;
    } // getById

    public static StringData delete(DbConn dbc, String userId) {
        StringData sd = new StringData();

        if (userId == null) {
            sd.errorMsg = "modeluserId.DbMods.delete: " +
                    "cannot delete web_user record because 'userId' is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) { // cannot proceed, db error
            return sd;
        }

        try {
            String sql = "DELETE FROM web_user WHERE web_user_id = ?";

            // Compile the SQL (checking for syntax errors against connected DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement
            pStatement.setString(1, userId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                sd.errorMsg = "Record not deleted - there was no record with web_user_id " + userId;
            } else if (numRowsDeleted > 1) {
                sd.errorMsg = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }
        } catch (Exception e) {
            if (e.getMessage().contains("foreign key constraint fails")) {
                sd.errorMsg = "A record in the jobs table points to this user; cannot be deleted.";
            } else {
                sd.errorMsg = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage(); 
            }
        }
        return sd;
    } // delete
}
