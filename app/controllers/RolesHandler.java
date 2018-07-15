package controllers;

import models.deadbolt.RoleHolder;
import play.mvc.Controller;
import controllers.deadbolt.DeadboltHandler;
import controllers.deadbolt.ExternalizedRestrictionsAccessor;
import controllers.deadbolt.RestrictedResourcesHandler;

public class RolesHandler extends Controller implements DeadboltHandler {

    @Override
    public void beforeRoleCheck() {
        if (!request.action.equals("Auth.login") && !request.action.equals("Auth.logout")
                && !request.action.equals("Auth.authenticate") && !request.action.equals("Auth.reinitialise")
                && !request.action.equals("Auth.reinitialisePassword") && !request.action.equals("Auth.reset")
                && !request.action.equals("Auth.resetPassword")) {
            if (BaseController.getCurrentUser() == null) {
                Auth.login();
            }
        }
    }

    @Override
    public RoleHolder getRoleHolder() {
        return BaseController.getCurrentUser();
    }

    @Override
    public void onAccessFailure(String controllerClassName) {
        flash.error("Acc&egrave;s Restreint.");
        Application.index();
    }

    @Override
    public RestrictedResourcesHandler getRestrictedResourcesHandler() {
        return null;
    }

    @Override
    public ExternalizedRestrictionsAccessor getExternalizedRestrictionsAccessor() {
        return null;
    }

}
