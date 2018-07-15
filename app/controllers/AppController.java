package controllers;

import java.io.IOException;

import controllers.gzip.Compress;
import play.Logger;
import play.Play;
import play.i18n.Lang;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.Util;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import play.mvc.With;

@With({Compress.class})
public class AppController extends Controller {

    protected static ObjectMapper jsonObjectMapper = null;

    /*
     * @Util public static User getMe() { String meIdString =
     * session.get("me.id"); if (meIdString != null) { return
     * User.findById(Long.parseLong(meIdString)); } else { return null; } }
     */

    @Util
    public static void renderJSON(Object object) {
        if (object != null) {
            if (jsonObjectMapper == null) {
                jsonObjectMapper = new ObjectMapper();
                jsonObjectMapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
                // jsonObjectMapper.setSerializationInclusion(Include.NON_NULL);
            }

            if (Play.mode.isDev() || Play.runingInTestMode()) {
                jsonObjectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
                Logger.setUp("DEBUG");
            }

            try {
                String jsonString = jsonObjectMapper.writeValueAsString(object);
                Logger.debug("Rendering JSON" + "\n --------------------------------- " + "\n %s : %s" + "\n --------------------------------- ", object.getClass().getCanonicalName(), jsonString);
                Controller.renderJSON(jsonString);
            } catch (JsonGenerationException e) {
                throw new RuntimeException(e);
            } catch (JsonMappingException e) {
                throw new RuntimeException(e);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            ok();
        }
    }

    @Before
    public static void setLanguage() {
        if (session.get("lang") != null) {
            Lang.set(session.get("lang"));
        } else {
            String lang = Play.configuration.getProperty("application.langs.default");
            if (lang == null) {
                lang = "fr";
            }
            session.put("lang", lang);
            Lang.set(lang);
        }
    }


    @Util
    public static String getJson(Object objectList){
        String response = null;
        if(objectList != null){
            jsonObjectMapper = new ObjectMapper();
            try {
                response = jsonObjectMapper.writeValueAsString(objectList);
            }catch (Exception e){
                e.printStackTrace();
            }
            return response;
        }else {
            return response;
        }
    }
}
