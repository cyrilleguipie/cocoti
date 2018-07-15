package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "permissionshasrole")
public class PermissionHasProfile extends BaseModel {

    @JsonProperty
    @ManyToOne
    private Permission permission;
    
    @JsonProperty
    @ManyToOne
    private Profile profile;

	@JsonProperty
	private boolean pread;

	@JsonProperty
	private boolean pcreate;

	@JsonProperty
	private boolean pupdate;

	@JsonProperty
	private boolean pdelete;

	public boolean isPread() {
		return pread;
	}

	public void setPread(boolean pread) {
		this.pread = pread;
	}

	public boolean isPcreate() {
		return pcreate;
	}

	public void setPcreate(boolean pcreate) {
		this.pcreate = pcreate;
	}

	public boolean isPupdate() {
		return pupdate;
	}

	public void setPupdate(boolean pupdate) {
		this.pupdate = pupdate;
	}

	public boolean isPdelete() {
		return pdelete;
	}

	public void setPdelete(boolean pdelete) {
		this.pdelete = pdelete;
	}

	public void setAllRights(){
		this.pread = true;
		this.pcreate = true;
		this.pupdate = true;
		this.pdelete = true;
	}

	public Permission getPermission() {
		return permission;
	}

	public void setPermission(Permission permission) {
		this.permission = permission;
	}

	public Profile getProfile() {
		return profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	public static PermissionHasProfile findByName(Permission name){
    	PermissionHasProfile permission = PermissionHasProfile.find("permission is ?", name).first();
    	return permission;
    }
    
    public static List<PermissionHasProfile> findByProfile(Profile name){
    	List<PermissionHasProfile> permissions = PermissionHasProfile.find("profile is ?", name).fetch();
    	return permissions;
    }
}
