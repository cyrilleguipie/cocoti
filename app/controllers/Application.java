package controllers;


import models.*;
import notifier.Mails;
import org.apache.commons.mail.EmailException;
import play.cache.*;
import play.libs.Images;
import play.mvc.Before;

import utils.Util;

import java.util.ArrayList;
import java.util.List;

public class Application extends BaseController {

    @Before
    public static void addViewParameters() {
        User user = BaseController.getCurrentUser();
        List<User> users = User.findAll();
        List<Event> events = Event.findAll();
        renderArgs.put("users", users);
        renderArgs.put("events", events);
        renderArgs.put("userCount", users.size());
        renderArgs.put("eventCount", events.size());


    }


    public static void index() {
        //checkAuthenticity();
        render();


    }








}