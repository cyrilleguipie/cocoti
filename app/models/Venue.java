package models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;


@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Venue extends BaseModel{

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String title;

    @JsonProperty
    private double lat;
    @JsonProperty
    private double lng;

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
