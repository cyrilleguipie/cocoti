package models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Event extends BaseModel {
    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String title;

    @JsonProperty
    @ManyToOne
    private EventType eventType;

    @JsonProperty
    @ManyToOne
    private Category category;

    @JsonProperty
    private String organizer;

    @JsonProperty
    private String description;

    @JsonProperty
    @ManyToOne
    private Venue venue;

    @JsonProperty
    private Date startDate;

    @JsonProperty
    private Date endDate;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String time;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String infoline;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String price;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String img;

    @JsonProperty
    @ManyToOne
    private User owner;

    @JsonProperty
    private boolean certif;
    @JsonProperty
    private int state;

    @JsonProperty
    private int participants;

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public boolean isCertif() {
        return certif;
    }

    public void setCertif(boolean certif) {
        this.certif = certif;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getParticipants() {
        return participants;
    }

    public void setParticipants(int participants) {
        this.participants = participants;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getInfoline() {
        return infoline;
    }

    public void setInfoline(String infoline) {
        this.infoline = infoline;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public void incParticipants(){
        setParticipants(getParticipants()+1);
    }

    public void decParticipants(){
        if(getParticipants() >0 )
        setParticipants(getParticipants()-1);
    }
}
