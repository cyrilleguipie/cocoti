package controllers;

import com.google.gson.Gson;
import models.EventType;
import models.api.SearchHandler;
import play.i18n.Messages;
import play.mvc.Before;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class EventTypes extends BaseController{
    static final List<String> SORT_FIELDS = Collections.singletonList("title");
    static final String defaultSortFields = "title";

    @Before
    public static void addViewParameters() {

    }

    public static void delete(long id) {
        //checkAuthenticity();
        EventType object = EventType.findById(id);
        if (object != null) {
            try {
                object.delete();
                flash.success("object.deleted.success");
                list(null, null, null, 1);
            } catch (Exception e) {
                flash.error(Messages.get("object_has_children.error"));
                view(id);
            }
        } else {
            flash.error("object.deleted.error");
            list(null, null, null, 1);
        }
    }

    public static void edit(Long id) {
        if (id != null) {
            EventType object = EventType.findById(id);
            if (object != null) {
                render(object);
            } else {
                flash.error("object.not_found");
                list(null, null, null, 1);
            }
        }
        render();
    }

    public static void list(String k, String sF, String sD, int page) {
        HashMap<String, Object> result = new SearchHandler<EventType>(EventType.class, SORT_FIELDS).search(null, sF, sD, page, defaultSortFields);
        renderArgs.put("results", getJson(result));
        render(result, k, sF, sD, page);
    }

    public static void update(EventType object) {
        //checkAuthenticity();
        System.out.println(new Gson().toJson(object));
        if (object != null) {
            if (object.validateAndSave()) {
                flash.success("object.updated.success");
                list(null, null, null, 1);
            }
        }
        flash.error("object.updated.error");
        renderTemplate("EventTypes/edit.html", object);
    }

    public static void view(long id) {
        if (id > 0) {
            EventType object = EventType.findById(id);
            if (object != null) {
                renderJSON(object);
            }
        }
        flash.error("object.not_found");
        list(null, null, null, 1);
    }
}
