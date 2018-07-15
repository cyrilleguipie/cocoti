package utils;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.commons.lang.RandomStringUtils;
import play.Logger;
import play.Play;
import play.mvc.Controller;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Util {

  public static String formatAmount(double value) {
    DecimalFormat myFormatter = new DecimalFormat("###,###.###");
    return myFormatter.format(value);
  }

  public static String generateSerial(){
    int higher = 10000;
    int random = (int) (Math.random() * higher);
    Date date = new Date();
    String code = new StringBuilder(String.valueOf(random))
            .append(RandomStringUtils.randomAlphabetic(8)).append(date.getTime()).toString();

    return code;
  }
  protected static ObjectMapper jsonObjectMapper = null;

  /*
   * @Util public static User getMe() { String meIdString =
   * session.get("me.id"); if (meIdString != null) { return
   * User.findById(Long.parseLong(meIdString)); } else { return null; } }
   */


  public static String toJSON(Object object) {
    String jsonString = null;

      if (jsonObjectMapper == null) {
        jsonObjectMapper = new ObjectMapper();
        jsonObjectMapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
        // jsonObjectMapper.setSerializationInclusion(Include.NON_NULL);
      }



      try {
        jsonString = jsonObjectMapper.writeValueAsString(object);
        Logger.debug("Rendering JSON" + "\n --------------------------------- " + "\n %s : %s" + "\n --------------------------------- ", object.getClass().getCanonicalName(), jsonString);

      } catch (JsonGenerationException e) {
        throw new RuntimeException(e);
      } catch (JsonMappingException e) {
        throw new RuntimeException(e);
      } catch (IOException e) {
        throw new RuntimeException(e);
      }

    return jsonString;
  }

  public static <T> T toObject(String jsonString, Class<T> type){
    T obj = null;
    if (jsonObjectMapper == null) {
      jsonObjectMapper = new ObjectMapper();
      //jsonObjectMapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
      // jsonObjectMapper.setSerializationInclusion(Include.NON_NULL);
    }
    try{
      obj = jsonObjectMapper.readValue(jsonString, type);
    }catch (IOException e){
      e.printStackTrace();
    }

    return obj;
  }

  public static <T> ArrayList<T> toObjects(String jsonString, Class<T> type){
    ArrayList<T> obj = null;
    if (jsonObjectMapper == null) {
      jsonObjectMapper = new ObjectMapper();
      //jsonObjectMapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
      //// jsonObjectMapper.setSerializationInclusion(Include.NON_NULL);

    }
    try{
      Class<?> clz = Class.forName(type.getName());
      JavaType jtype = jsonObjectMapper.getTypeFactory().constructCollectionType(List.class, clz);
      //obj = jsonObjectMapper.readValue(jsonString, new TypeReference<List<T>>(){});
      obj = jsonObjectMapper.readValue(jsonString, jtype);
    }catch (IOException e){
      e.printStackTrace();
    }catch (ClassNotFoundException e){
      e.printStackTrace();
    }

    return obj;
  }

  public static String generateToken(){
    return org.apache.commons.lang.RandomStringUtils.randomNumeric(4);
  }
}

