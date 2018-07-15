package models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.security.ntlm.Client;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * @author billyaymeric on 18/05/2016.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class ClientDevice extends BaseModel {

    @ManyToOne
    @JsonProperty
    private User client;

    @ManyToOne
    @JsonProperty
    private Device device;


    public static Device getLastDeviceByClient(User client){
        Device device = null;
        ClientDevice cd = ClientDevice.find("client.id is ? order by created desc", client.getId()).first();
        if(cd != null){
            device = cd.getDevice();
        }
        return device;
    }


    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }
}
