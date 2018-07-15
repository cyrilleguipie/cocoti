package controllers;

import com.google.gson.Gson;
import models.Event;
import models.api.SearchHandler;
import play.i18n.Messages;
import play.mvc.Before;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class Events extends BaseController {
    static final List<String> SORT_FIELDS = Collections.singletonList("created");
    static final String defaultSortFields = "created";

    public static void list(String k, String sF, String sD, int page) {
        HashMap<String, Object> result = new SearchHandler<Event>(Event.class, SORT_FIELDS).search(null, sF, sD, page, defaultSortFields);
        render(result, k, sF, sD, page);
    }

    public static void view(long id) {
        if (id > 0) {
            Event object = Event.findById(id);
            if (object != null) {
                render(object);
            }
        }
        flash.error("object.not_found");
        list(null, null, null, 1);
    }

    public static void generateFolder(Long id){
        HashMap<String, Object> response = new HashMap<>();
        if(id == null || id <= 0){
            response.put("error", true);
            response.put("msg", "NULL");
            //list();
        } else {
            Event event = Event.findById(id);

            if(event == null){
                response.put("error", true);
                response.put("msg", "NULL");

                view(id);
            } else {
                //new GenerateFolderForEventJob(event.getId()).now();

                view(id);
            }
        }
    }
}