package jobs;

import com.google.gson.Gson;
import models.Device;
import models.Event;
import play.jobs.Job;
import play.libs.WS;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by cyrilleguipie on 4/8/17.
 */
public class AlertJob extends Job {

    private static final String FIREBASE_HOST = "https://fcm.googleapis.com/fcm/send";
    private static final String API_KEY = String.format("key=%s", "AAAAxF224Yg:APA91bEg7m6EomD1pH6uGE1zE7YDLifUOQwU74K9DiiyYBOnX4DCueoqK9YX7YKDWXnaaJHDyb8TmqoerhHhllQu7pbmNNX-EUXXI7PHB5awkDtYb3AacqpgCXaQjuebvroSPo2MRehl");

    private long eventId;
    private Event event;

    private Map<String, Object> data = new HashMap<>();

    public AlertJob(long eventId) {

        this.eventId  = eventId;
        event = Event.findById(eventId);

            data.put("title", "Nouvel evenement");
            data.put("body", event.getTitle());
            data.put("collapse_key", "EVENT");

    }

    @Override
    public void doJob() throws Exception {

        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", API_KEY);

        System.out.println("Start Notification Job");

        List<String> registrationIds = new ArrayList<>();
        List<Device> devices = Device.findAll();
        for(Device device : devices){
            registrationIds.add(device.getRegistrationId());
        }

            Map<String, Object> params = new HashMap<>();
            params.put("registration_ids", registrationIds);
            params.put("data", data);

            WS.HttpResponse httpResponse = WS.url(FIREBASE_HOST)
                    .headers(headers)
                    .body(new Gson().toJson(params))
                    .post();

            System.out.println(httpResponse.getString());

            System.out.println("End Notification Job");

    }
}
