package models;

import play.data.validation.Required;
import play.db.jpa.Model;

import javax.persistence.Entity;
import javax.persistence.Lob;

import java.util.Date;

@Entity
public class TrashItem extends Model {

    private Date deletionDate;

    @Required
    private String modelClassName;

    @Required
    @Lob
    private String modelDataJson;

    @Required
    private Long modelId;

    public TrashItem(BaseModel model) {
        this.setModelId(model.getId());
        this.modelClassName = model.getClass().getName();
        this.deletionDate = new Date();
        this.modelDataJson = model.toJson();
    }

    public Date getDeletionDate() {
        return this.deletionDate;
    }

    public String getModelClassName() {
        return this.modelClassName;
    }

    public String getModelDataJson() {
        return this.modelDataJson;
    }

    public Long getModelId() {
        return modelId;
    }

    public void setDeletionDate(Date deletionDate) {
        this.deletionDate = deletionDate;
    }

    public void setModelClassName(String modelClassName) {
        this.modelClassName = modelClassName;
    }

    public void setModelDataJson(String modelDataJson) {
        this.modelDataJson = modelDataJson;
    }

    public void setModelId(Long modelId) {
        this.modelId = modelId;
    }

    public static String LOG_TAG = TrashItem.class.getName();

}
