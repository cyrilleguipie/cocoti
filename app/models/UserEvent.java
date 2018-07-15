package models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class UserEvent extends BaseModel{

    @JsonProperty
    @ManyToOne
    private User attendee;

    @JsonProperty
    @ManyToOne
    private Event event;

    public User getAttendee() {
        return attendee;
    }

    public void setAttendee(User attendee) {
        this.attendee = attendee;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}
