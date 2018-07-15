package controllers.api;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jobs.AlertJob;
import models.*;
import notifier.Mails;
import org.apache.commons.mail.EmailException;
import utils.Util;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by alexwilfriedo on 06/03/2018.
 */
public class BootServices extends ApiController {

    static HashMap<String, Object> response = null;
    static HashMap<String, Object> datas = null;

    public static void createEvent(long userId, String data){
        response = new HashMap<>();
        datas = new HashMap<>();
        System.out.println(data);
        User user = User.findById(userId);
        user.incOwnCount();
        user.save();
        //JsonObject object = (JsonObject) new JsonParser().parse(data);
        Event _event = Util.toObject(data, Event.class);
        Venue venue = null;
        if(_event.getVenue() != null){
            venue = new Venue();
            venue.setLat(_event.getVenue().getLat());
            venue.setLng(_event.getVenue().getLng());
            venue.setTitle(_event.getVenue().getTitle());
            venue.save();
        }
        Event event = new Event();
        event.setVenue(venue);
        event.setTime(_event.getTime());
        event.setCategory(_event.getCategory());
        event.setDescription(_event.getDescription());
        event.setOwner(user);
        event.setEndDate(_event.getEndDate());
        event.setStartDate(_event.getStartDate());
        event.setEventType(_event.getEventType());
        event.setImg(_event.getImg());
        event.setInfoline(_event.getInfoline());
        event.setOrganizer(_event.getOrganizer());
        event.setTitle(_event.getTitle());
        event.setState(1);


//        if(object.has("venue")){
//            if(object.get("venue").toString() != null && !object.get("venue").toString().equals("")
//                    ){
//                venue  = Util.toObject(object.get("venue").toString(), Venue.class);
//                if(venue != null) {
//                    venue.save();
//                }
//            }
//        }

        //event.setOwner(user);

        event.save();

        datas.put("event", event);
        datas.put("user", user);
        response.put("data", datas);
        response.put("message", "SUCCES");
        response.put("error", false);
        new AlertJob(event.id).in(3);
        renderJSON(response);


    }

    public static void device(String imei, String regId, long id, String type) {
        System.out.println("imei --->" + imei + "\n" + "regId --->" + regId + "\n" + "id---->" + id);
        HashMap<String, Object> response = new HashMap<String, Object>();

        Device device = Device.find("registrationId is ?", regId).first();
        if (device == null) {
            device = new Device();
            device.setImei(imei);
            device.setType(type);
            device.setRegistrationId(regId);
            device.save();

        }


        if (id != 0) {
            User client = User.findById(id);
            if (client != null) {
                ClientDevice clientDevice = new ClientDevice();
                clientDevice.setClient(client);
                clientDevice.setDevice(device);
                clientDevice.save();
            }
        }
        response.put("error", false);
        response.put("message", "SUCCES");
        renderJSON(response);

    }


    public static void updateProfile(long userId, String data){
        System.out.println("UPADTE PROFILE  ---> "+data);
        response = new HashMap<>();
        datas = new HashMap<>();
        User user = User.findById(userId);
        JsonObject object = (JsonObject) new JsonParser().parse(data);
        User user2 = Util.toObject(object.toString(), User.class);
        user.setCity(user2.getCity());
        user.setCountry(user2.getCountry());
        user.setLastname(user2.getLastname());
        user.setFirstname(user.getFirstname());
        user.setFullname();
        user.setPhone(user2.getPhone());
        user.save();
        datas.put("user", user);
        response.put("data", datas);
        response.put("message", "SUCCES");
        response.put("error", false);
        renderJSON(response);
    }


    public static void updateEvent(long eventId, String data){

    }


    public static void attendEvent(long eventId, long userId, boolean state){
        System.out.println("state "+state);
        response = new HashMap<>();
        datas = new HashMap<>();
        User user = User.findById(userId);
        Event event = Event.findById(eventId);
        if(state){
            user.incAttendCount();
            event.incParticipants();

            UserEvent userEvent = new UserEvent();
            userEvent.setAttendee(user);
            userEvent.setEvent(event);
            userEvent.save();
        }else{
            user.decAttendCount();
            event.decParticipants();
            UserEvent.delete("attendee.id is ? and event.id is ?", userId, eventId);

        }
        user.save();
        event.save();
        Set<Long> mine = new HashSet<>();
        mine.add(eventId);
        datas.put("event", event);
        datas.put("user", user);
        datas.put("mine", mine);
        response.put("data", datas);
        response.put("message", "SUCCES");
        response.put("error", false);

        renderJSON(response);



    }


    public static void getAllEvents(long userId){
        response = new HashMap<>();
        datas = new HashMap<>();
        List<Event> events = Event.find("state is ?", 1).fetch();
        List<Category> categories = Category.findAll();
        List<EventType> eventTypes = EventType.findAll();
        Set<Long> mine = new HashSet<>();
        User user = User.findById(userId);
            if(user != null) {
                List<UserEvent> userEvents = UserEvent.find("attendee.id is ? and event.state is ?", userId, 1).fetch();
                for(UserEvent userEvent : userEvents) {
                    mine.add(userEvent.getEvent().getId());
                }
                datas.put("mine", mine);
            }
        datas.put("categories", categories);
        datas.put("eventTypes", eventTypes);
            datas.put("events", events);
            response.put("data", datas);
            response.put("message", "SUCCES");
            response.put("error", false);
            renderJSON(response);
        }


    public static void main(long id){
        Event event = Event.findById(id);
        render(event);
    }
    }









