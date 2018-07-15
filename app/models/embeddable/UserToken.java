package models.embeddable;

import utils.EncryptionUtility;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.util.UUID;

/**
 * Created by alexwilfriedo on 19/02/2018.
 */
@Embeddable
public class UserToken {

    @Column(unique = true)
    private String accountConfirmationToken;

    @Column(unique = true)
    private String accountConfirmationPin;

    @Column(unique = true)
    private String changePasswordToken;

    @Column(unique = true)
    private String apiToken;

    @Column(unique = true)
    private String fcmToken;

    public String getAccountConfirmationToken() {
        return accountConfirmationToken;
    }

    public void setAccountConfirmationToken(String accountConfirmationToken) {
        this.accountConfirmationToken = accountConfirmationToken;
    }

    public String getAccountConfirmationPin() {
        return accountConfirmationPin;
    }

    public void setAccountConfirmationPin(String accountConfirmationPin) {
        this.accountConfirmationPin = accountConfirmationPin;
    }

    public String getChangePasswordToken() {
        return changePasswordToken;
    }

    public void setChangePasswordToken(String changePasswordToken) {
        this.changePasswordToken = changePasswordToken;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

    public String getFcmToken() {
        return fcmToken;
    }

    public void setFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }

    public final void generateAccountConfirmationToken(){
        String accountConfirmation = EncryptionUtility.sha256From(UUID.randomUUID().toString());
        if(accountConfirmation == null) accountConfirmation = "";
        this.accountConfirmationToken = accountConfirmation;
    }

    public final void generateAccountConfirmationPin(){
        this.accountConfirmationPin = EncryptionUtility.randomizePinCode();
    }

    public final void cleanAccountConfirmationToken() {
        this.accountConfirmationToken = (String)null;
        this.accountConfirmationPin = (String)null;
    }

    public final void generateChangePasswordToken() {
        String changePasswordToken = EncryptionUtility.sha256From(UUID.randomUUID().toString());
        if(changePasswordToken == null) changePasswordToken = "";
        this.changePasswordToken = changePasswordToken;
    }

    public final void cleanChangePasswordToken() {
        this.accountConfirmationToken = "";
    }

    public final void generateApiToken() {
        String apiToken = EncryptionUtility.sha256From(UUID.randomUUID().toString());
        if(apiToken == null) apiToken = "";
        this.apiToken = apiToken;
    }
}