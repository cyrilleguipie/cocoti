package models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;

/**
 * Created by ROMUALD on 11/09/2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Notif extends BaseModel {

    @JsonProperty
    private long eventId;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String title;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String content;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
