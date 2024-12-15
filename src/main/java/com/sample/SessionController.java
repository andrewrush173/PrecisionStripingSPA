package com.sample;

import dbUtils.DbConn;
import dbUtils.Json;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import model.webUser.StringData;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import view.LogonView;

@RestController
public class SessionController {
   public SessionController() {
   }

   @RequestMapping(
      value = {"/session/Login"},
      params = {"email", "password"},
      produces = {"application/json"}
   )
   public String Login(@RequestParam("email") String email, @RequestParam("password") String password, HttpServletRequest request) {
      new StringData();
      DbConn dbc = new DbConn();
      HttpSession session = request.getSession();
      StringData webUserobj = LogonView.getUserInformation(dbc, email, password);

      try {
         session.setAttribute("LoginInfo", webUserobj);
      } catch (Exception var8) {
         System.out.println("Session/Login Controller Error: " + var8.getMessage());
         session.invalidate();
         String var = webUserobj.errorMsg;
         webUserobj.errorMsg = var + ". " + var8.getMessage();
      }

      dbc.close();
      return Json.toJson(webUserobj);
   }

   @RequestMapping(
      value = {"/session/read"},
      produces = {"application/json"}
   )
   public String GetProfile(HttpServletRequest request) {
      HttpSession session = request.getSession();
      StringData webUserobj = new StringData();

      try {
         webUserobj = (StringData)session.getAttribute("LoginInfo");
         if (webUserobj != null) {
            webUserobj.errorMsg = "Above data was read from the session";
         } else {
            webUserobj = new StringData();
            webUserobj.errorMsg = "You are not currently logged in";
         }
      } catch (Exception var5) {
         System.out.println("session/Read controller error: " + var5.getMessage());
         session.invalidate();
         String var10001 = webUserobj.errorMsg;
         webUserobj.errorMsg = var10001 + ". " + var5.getMessage();
      }

      return Json.toJson(webUserobj);
   }

   @RequestMapping(
      value = {"/session/logout"},
      produces = {"application/json"}
   )
   public String Logout(HttpServletRequest request) {
      HttpSession session = request.getSession();
      StringData webUserObj = new StringData();

      try {
         session.invalidate();
         webUserObj.errorMsg = "Session has been invalidated";
      } catch (Exception var5) {
         System.out.println("session/invalidate controller error: " + var5.getMessage());
         String var10001 = webUserObj.errorMsg;
         webUserObj.errorMsg = var10001 + ". " + var5.getMessage();
      }

      return Json.toJson(webUserObj);
   }
}
