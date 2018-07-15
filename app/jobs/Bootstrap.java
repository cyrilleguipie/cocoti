package jobs;


import models.*;
import play.Logger;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import java.util.List;



//@Every("3min")
@OnApplicationStart
public class Bootstrap extends Job {

    @Override
    public void doJob() {

        Logger.info("Start loading bootstrap");

        loadRoles();
        loadCategories();
        loadType();
        loadPermissions();
        loadPermissionsHasRole();


        User superUser = User.findByEmail("admin@yepado.com");
        Profile profile = Profile.findByName("MAINTENANCE");
        if (superUser == null) {
            Logger.info("Start loading superUser");

            superUser = new User("Maintenance", "Yepado", "admin@yepado.com",
                    "22556525610", "password", profile);
            superUser.setStatus(1);
            superUser.save();
            Logger.info("End loading SuperUser");
        }



        Logger.info("End loading Bootstrap");
        Logger.info("Application started");
    }




    public void loadRoles() {
        List<Profile> roles = Profile.findAll();
        if (roles.size() < 1) {

            Profile role = null;
            String[] occurence = {"CLIENT", "LIVRAISON", "ADMIN", "MAINTENANCE"};
            int[] occurence2 = {100, 300, 500, 1000};
            for (int i = 0; i < occurence.length; i++) {
                role = new Profile();
                role.setTitle(occurence[i]);
                role.setCode(occurence2[i]);
                role.save();
            }

        }
    }

    public void loadCategories() {
        List<Category> roles = Category.findAll();
        if (roles.size() < 1) {

            Category role = null;
            String[] occurence = {"Religion & Culture", "Showbiz & Cinema", "Professionnel & Politique"
                    , "Competition"};
            for (int i = 0; i < occurence.length; i++) {
                role = new Category();
                role.setTitle(occurence[i]);
                role.save();
            }

        }
    }


    public void loadType() {
        List<EventType> roles = EventType.findAll();
        if (roles.size() < 1) {

            EventType role = null;
            String[] occurence = {"Type 1", "Type 2", "Type 3"};
            for (int i = 0; i < occurence.length; i++) {
                role = new EventType();
                role.setTitle(occurence[i]);
                role.save();
            }

        }
    }


    public void loadPermissions() {
        List<Permission> permissions = Permission.findAll();
        if (permissions.size() < 1) {

            Permission permission = null;
            String[] occurence = {"Application"};
            for (int i = 0; i < occurence.length; i++) {
                permission = new Permission();
                permission.setTitle(occurence[i]);
                permission.setLink("/");
                permission.save();
            }
        }
    }




    public void loadPermissionsHasRole() {
        List<PermissionHasProfile> permissionsHasRoles = PermissionHasProfile.findAll();
        if (permissionsHasRoles.size() < 1) {
            //TODO: ADD PERMISSIONS
        }
    }


}
