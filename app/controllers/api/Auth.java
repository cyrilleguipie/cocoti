package controllers.api;

import models.Category;
import models.EventType;
import models.User;
import play.Logger;

import java.util.HashMap;
import java.util.List;

/**
 * Created by ROMUALD on 02/12/2016.
 */
public class Auth extends ApiController {

    public static void authenticate(String login, String password, boolean auth) {

        HashMap<String, Object> response = new HashMap<String, Object>();
        HashMap<String, Object> data = new HashMap<String, Object>();

        if (login == null || password == null) {
            response.put("error", true);
            response.put("message", "login and password are required");
            renderJSON(response);
        } else {
            List<Category> categories = Category.findAll();
            List<EventType> eventTypes = EventType.findAll();
            if(auth){
                User user = User.authenticate(login, password);
                if (user == null) {
                    response.put("error", true);
                    response.put("message", "Incorrect login or password");
                    renderJSON(response);
                } else {
                    Logger.info("Start Loading Profile for Mobile");
                    data.put("user", user);
                    data.put("categories", categories);
                    data.put("eventTypes", eventTypes);
                    response.put("error", false);
                    response.put("message", "Authentification OK");
                    response.put("data", data);
                    renderJSON(response);
                }
            }else{
                User user = User.findByPhone(login);
                if(user != null){
                    response.put("error", true);
                    response.put("message", "Compte existant");
                    renderJSON(response);
                }else{
                    user = new User();
                    user.setPhone(login);
                    user.setPassword(password);
                    user.save();
                    data.put("user", user);
                    data.put("categories", categories);
                    data.put("eventTypes", eventTypes);
                    response.put("error", false);
                    response.put("message", "Authentification OK");
                    response.put("data", data);
                    renderJSON(response);

                }
            }

        }
    }

    public static void forgetPassword(String login) {

        HashMap<String, Object> response = new HashMap<String, Object>();

        if (login == null) {
            response.put("error", true);
            response.put("message", "login are required");
            renderJSON(response);
        } else {
            User user = User.findByEmail(login);
            if (user == null) {
                response.put("error", true);
                response.put("message", "Incorrect login");
                renderJSON(response);
            } else {
                Logger.info("Start Loading Account for requestPassword");
                //TODO: SEND MAIL FOR LINK
                response.put("error", false);
                response.put("message", "ForgetPassword OK");
                response.put("data", user.getId());
                renderJSON(response);
            }
        }
    }

    public static void resetPassword(long id, String password, String newPassword) {

        HashMap<String, Object> response = new HashMap<String, Object>();
        User user = User.findById(id);

        if (user == null || newPassword.isEmpty()) {
            response.put("error", true);
            response.put("message", "Agent or password is NULL");
            renderJSON(response);
        } else {
            if (password != null && !password.isEmpty()) {
                if (!user.checkIfPasswordAreEquals(password)) {
                    response.put("error", true);
                    response.put("message", "PASSWORD_DIFFERENTS");
                    renderJSON(response);
                }
            }

            Logger.info("Start ResetPassword");
            user.setPassword(newPassword);
            user.save();
            //TODO: SEND MAIL FOR LINK
            response.put("error", false);
            response.put("message", "RESETPASSWORD OK");
            renderJSON(response);
        }
    }
}
