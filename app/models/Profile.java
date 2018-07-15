package models;


import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Profile extends BaseModel implements models.deadbolt.Role {
	
    @JsonProperty
	@Type(type = "org.hibernate.type.TextType")
	private String title;

	@JsonProperty
    private int code;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	@Override
	public String getRoleName() {
		return this.title;
	}

	public static Profile findByName(String name){
    	Profile profile = Profile.find("title is ?", name).first();
    	return profile;
    }

	public static Profile findByCode(int code){
		Profile profile = Profile.find("code is ?", code).first();
		return profile;
	}
}