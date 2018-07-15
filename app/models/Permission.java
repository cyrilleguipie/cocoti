package models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;

@Entity
public class Permission extends BaseModel {
	
    @JsonProperty
	@Type(type = "org.hibernate.type.TextType")
	private String title;

	@JsonProperty
	@Type(type = "org.hibernate.type.TextType")
	private String link;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

    public static Permission findByName(String name){
    	Permission permission = Permission.find("title is ?", name).first();
    	return permission;
    }
}
