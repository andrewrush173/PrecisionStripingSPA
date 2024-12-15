package view;

import dbUtils.DbConn;
import dbUtils.Format;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.webUser.StringData;

public class LogonView {
   public LogonView() {
   }

   public static StringData getUserInformation(DbConn dbc, String Email, String Password) {
      StringData sd = new StringData();
      sd.errorMsg = dbc.getErr();
      if (sd.errorMsg.length() > 0) {
         return sd;
      } else {
         try {
            String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, user_image, web_user.user_role_id, user_role_type FROM web_user, user_role WHERE web_user.user_role_id = user_role.user_role_id AND user_email = ? AND user_password = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            stmt.setString(1, Email);
            stmt.setString(2, Password);

            ResultSet results = stmt.executeQuery();
            results.next();

            sd = new StringData();
            
            sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
            sd.userEmail = Format.fmtString(results.getObject("user_email"));
            sd.userPassword = Format.fmtString(results.getObject("user_password"));
            sd.userImage = Format.fmtString(results.getObject("user_image"));
            sd.birthday = Format.fmtDate(results.getObject("birthday"));
            sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
            sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
            sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));

            results.close();
            stmt.close();
         } catch (Exception var7) {
            sd.errorMsg = "Exception thrown in LogonView.LogUserIn(): " + var7.getMessage();
         }

         return sd;
      }
   }
}
