package controllers;

import controllers.deadbolt.Deadbolt;
import models.User;
import play.mvc.Before;
import play.mvc.Util;
import play.mvc.With;

@With({Deadbolt.class})
public class BaseController extends AppController {

  @Util
  public static User getCurrentUser() {
    String username = session.get(User.SESSION_KEY);
    if (username != null) {
      return User.findByEmail(username);
    } else {
      return null;
    }
  }

  @Before
  @Util
  static void setViewParameters() {
    User user = BaseController.getCurrentUser();
    if (user != null) {
      renderArgs.put(User.VIEW_VARIABLE_NAME, user);
      renderArgs.put(User.SESSION_KEY, user.getEmail());

      renderArgs.put("clientRole", user.getRoles().get(0).getCode());


      if(user.getRoles().get(0).getCode() == 1000){
        session.put("clientRole", "admin");
      } else if(user.getRoles().get(0).getCode() == 300) {
        session.put("clientRole", "livraison");
      } else {
        session.put("clientRole", "client");
      }
    }
  }

}
