package models;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.hibernate.annotations.Type;
import play.Logger;
import play.data.binding.NoBinding;
import play.db.jpa.Model;

import javax.persistence.*;
import java.io.IOException;
import java.util.Date;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NONE, getterVisibility = JsonAutoDetect.Visibility.NONE)
@MappedSuperclass
public abstract class BaseModel extends Model {

    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty
    @NoBinding
    private Date created;

    // Hack to remove persistent property from JSON output
    private transient boolean persistent;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty
    @NoBinding
    private Date updated;

    @Column(name = "created_by")
    @Type(type = "org.hibernate.type.TextType")
    @JsonProperty
    private String createdBy = null;

    @Column(name = "updated_by")
    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String updatedBy = null;

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    final public static int DEFAULT_PAGINATE_COUNT = 50;
    final public static String PAGINATE_OBJECT_KEY = "objects";
    final public static String PAGINATE_COUNT_KEY = "count";

    public Date getCreated() {
        return this.created;
    }

    @JsonGetter
    public Long getId() {
        return this.id;
    }

    @JsonIgnore
    public Boolean getPersistent() {
        return this.persistent;
    }

    public Date getUpdated() {
        return this.updated;
    }

    @PrePersist
    protected void onCreate() {
        this.updated = this.created = new Date();
    }

    @PreRemove
    protected void onDelete() {
        TrashItem trashItem = new TrashItem(this);
        trashItem.save();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated = new Date();
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    @JsonProperty("actionsButtons")
    public String getActionsButtons() {
        return "<a id=\"" + this.getId() + "\"" +
                "href=\"/hotels/" + this.getId() + "/edit\">" +
                "<i class=\"os-icon os-icon-edit-1\"></i>\n" +
                "</a><a id=\"" + this.getId() + "\"" +
                "href=\"/hotels/" + this.getId() + "/view\">" +
                "<i class=\"os-icon os-icon-tasks-checked\"></i>\n" +
                "</a>";
    }

    public String toJson() {
        String json = "";
        ObjectMapper jsonObjectMapper = new ObjectMapper().configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
        try {
            json = jsonObjectMapper.writeValueAsString(this);
        } catch (JsonGenerationException e) {
            Logger.error(e.getMessage());
        } catch (JsonMappingException e) {
            Logger.error(e.getMessage());
        } catch (IOException e) {
            Logger.error(e.getMessage());
        }
        return json;
    }

    public static int getStartFromPage(Integer page) {
        if ((page == null) || (page < 1)) {
            page = 1;
        }
        return ((page - 1) * DEFAULT_PAGINATE_COUNT);
    }
}
