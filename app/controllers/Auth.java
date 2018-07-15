package controllers;

import controllers.deadbolt.Unrestricted;

import models.User;
import notifier.Mails;
import play.Logger;
import play.data.validation.Required;

import javax.sql.ConnectionEvent;
import java.util.HashMap;

public class Auth extends BaseController {

    @Unrestricted
    public static void authenticate(String login, String password) {
        HashMap<String, Object> data = new HashMap<String, Object>();

        User user = User.authenticate(login, password);
        System.out.println("" + user);

        if (user == null) {
            flash.error("Le nom d'utilisateur ou le mot de passe est incorrect !");
            renderTemplate("Auth/login.html", login);
        } else {
            flash.success("Bienvenue");
            String userAgent = "";
            if(request.headers.containsKey("User-Agent")){
                userAgent = request.headers.get("User-Agent").value();
            }


            session.put(User.SESSION_KEY, user.getEmail());

            Application.index();
        }
    }

    @Unrestricted
    public static void login() {
        render();
    }


    @Unrestricted
    public static void logout() {
        session.current().clear();
        Application.index();
    }

    @Unrestricted
    public static void reinitialise() {
        render();
    }

    @Unrestricted
    public static void reset() {
        render();
    }

    @Unrestricted
    public static void reinitialisePassword(@Required String login) {
        User user = User.findByEmail(login);
        if (user == null) {
            flash.error("Le nom d'utilisateur est associé a aucun compte !");
            renderTemplate("Auth/reinitialise.html", login);
        } else {
            Logger.info(" " + user.getFullname());
            flash.error("Vous pouvez réinitialiser votre mot de passe !");
            renderTemplate("Auth/reset.html", login);
        }
    }

    @Unrestricted
    public static void resetPassword(@Required String login,
                                     @Required String password, @Required String cpassword) {

        User user = User.findByEmail(login);

        if (user == null) {
            flash.error("Le nom d'utilisateur est associé a aucun compte !");
            renderTemplate("Auth/reset.html", login, password, cpassword);
        } else {
            if (password.equals(cpassword)) {
                Logger.info("Start ResetPassword");
                user.setPassword(password);
                user.save();
                //TODO: SEND MAIL FOR LINK
                //Mails.passwordChange(user);
                login();
            } else {
                flash.error("Les mots de passe sont différents");
                renderTemplate("Auth/reset.html", login, password, cpassword);
            }
        }
    }




}
