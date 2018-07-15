package models;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import play.data.validation.Required;

import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Device extends BaseModel {

    @JsonProperty
    @Required
    private String imei;

    @JsonProperty
    @Required
    private String type;

    @JsonProperty
    private String registrationId;

    public Device() {
    }

    public Device(String imei) {
        this.imei = imei;
    }
   
    public String getImei() {
        return imei;
    }

    public String getType() {
        return type;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    public void setImei(String imei) {
        this.imei = imei;
    }


    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return registrationId;
    }

}
