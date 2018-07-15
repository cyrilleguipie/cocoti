package models;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import models.deadbolt.RoleHolder;
import models.embeddable.UserToken;
import org.hibernate.annotations.Type;


import com.fasterxml.jackson.annotation.JsonProperty;

import org.mindrot.jbcrypt.BCrypt;
import play.Play;
import play.data.binding.NoBinding;
import play.data.validation.Email;
import play.data.validation.Required;
import play.data.validation.Unique;
import play.libs.Crypto;
import utils.Constant;
import utils.EncryptionUtility;

import java.util.*;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity(name = "user_")
public class User extends BaseModel implements RoleHolder {

    final public static String SESSION_KEY = "username";

    final public static String VIEW_VARIABLE_NAME = "authUser";

    final public static String PERMISSIONS = "permissions";

    final public static String COUNTRY = "country";

    @NoBinding
    @Required
    public String passwordHash;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String firstname;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String lastname;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String fullname;
    @JsonProperty
    private int attendCount;
    @JsonProperty
    private int ownCount;

    public void incAttendCount(){
        setAttendCount(getAttendCount()+1);
    }

    public void decAttendCount(){
        setAttendCount(getAttendCount()-1);
    }

    public void incOwnCount(){
        setOwnCount(getOwnCount()+1);
    }

    public void decOwnCount(){
        setOwnCount(getOwnCount()-1);
    }



    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String city;

    @JsonProperty
    @Column(length = 20)
    private String phone = "";
    @JsonProperty
    private String country;


    @Unique
    @Email
    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String email;


    @JsonProperty
    private int status;

    @JsonProperty
    @Type(type = "org.hibernate.type.TextType")
    private String token;




    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    @JsonProperty
    private Set<Profile> roles;



    @Embedded
    private UserToken tokens = null;

    @JsonProperty
    @Column(length = Constant.JPA_CONSTRAINTS_THUMBNAIL)
    private String picture = null;


    public User(){};


    public User(String firstname, String lastname, String email, String phone,
                String password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.setPassword(password);
        this.roles = new HashSet<>();
    }

    public User(String firstname, String lastname, String email, String phone,
                String password, Profile role) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.setFullname();
        this.email = email;
        this.phone = phone;
        this.setPassword(password);
        this.roles = new HashSet<>();
        this.roles.add(role);
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserToken getTokens() {
        return tokens;
    }

    public void setTokens(UserToken tokens) {
        this.tokens = tokens;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstName) {
        this.firstname = firstName;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastName) {
        this.lastname = lastName;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullName) {
        this.fullname = fullName;
    }

    public void setFullname() {
        this.fullname = this.firstname + " " + this.lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRoles(Set<Profile> roles) {
        this.roles = roles;
    }

    public void addRoles(List<Profile> profiles) {
        if (profiles != null) {
            for (Profile profile : profiles) {
                addRole(profile);
            }
        }
    }

    public void addRole(Profile profile) {
        if (profile != null) {
            if (!this.roles.contains(profile)) {
                this.roles.add(profile);
            }
        }
    }

    public void removeRole(Profile profile) {
        if (profile != null) {
            if (this.roles.contains(profile)) {
                this.roles.remove(profile);
            }
        }
    }


    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    @Override
    public List<Profile> getRoles() {
        List<Profile> roles = new ArrayList<Profile>();
        roles.addAll(this.roles);
        return roles;
    }



    public static User findByEmail(String email)
            throws IllegalArgumentException {
        if (email == null) {
            throw new IllegalArgumentException("username parameter cannot be null.");
        } else {
            return User.find("email is ?", email).first();
        }
    }

    public static User findByPhone(String email)
            throws IllegalArgumentException {
        if (email == null) {
            throw new IllegalArgumentException("username parameter cannot be null.");
        } else {
            return User.find("phone is ?", email).first();
        }
    }

    @Override
    protected void onCreate() {
        super.onCreate();

        if (this.tokens == null) {
            this.tokens = new UserToken();
        }
        this.tokens.generateAccountConfirmationToken();
        this.tokens.generateAccountConfirmationPin();
        //this.apiKey = EncryptionUtility.sha256From(UUID.randomUUID().toString());
    }

    public boolean checkIfPasswordAreEquals(String passwordSubmit) {
        if ((passwordSubmit == null) || (passwordSubmit.length() < 6)) {
            throw new IllegalArgumentException(
                    "password length has to be greater than 6 characters.");
        } else {
            return BCrypt.checkpw(User.doWeakPasswordHash(passwordSubmit), this.passwordHash);
        }
    }

    public void setPassword(String password) throws IllegalArgumentException {
        if ((password == null) || (password.length() < 5)) {
            throw new IllegalArgumentException(
                    "password length has to be greater than 6 characters.");
        } else {
            this.passwordHash = User.doStrongPasswordHash(password);
        }
    }

    public int getAttendCount() {
        return attendCount;
    }

    public void setAttendCount(int attendCount) {
        this.attendCount = attendCount;
    }

    public int getOwnCount() {
        return ownCount;
    }

    public void setOwnCount(int ownCount) {
        this.ownCount = ownCount;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    private static String doStrongPasswordHash(String password) {
        return BCrypt.hashpw(User.doWeakPasswordHash(password), BCrypt.gensalt());
    }

    private static String doWeakPasswordHash(String password) {
        return Crypto.passwordHash(password + Play.configuration.getProperty("application.secret"), Crypto.HashType.SHA512);
    }

    public static User authenticate(String login, String password) {
        if ((login == null) || (password == null)) {
            throw new IllegalArgumentException();
        }
        User user = User.find("phone is ? or email is ?", login, login).first();
        if (user != null) {
            if (BCrypt.checkpw(User.doWeakPasswordHash(password), user.passwordHash)) {
                return user;
            }
        }

        return null;

    }

    public static User check(String phone, String email) {

        User user = User.find("phone is ? or email is ?", phone, email).first();


        return user;

    }




}
