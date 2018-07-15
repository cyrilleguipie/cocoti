package notifier;

import org.apache.commons.mail.EmailException;
import play.mvc.Mailer;

/**
 * @author Alexwilfriedo
 */
public class Mails extends Mailer {
  public static final String SUBJECT = "Informations Paiement";

  public static void register(String email, String fullname, String operation) throws EmailException {
    setContentType("text/html");
    setSubject("Bienvenue sur "+operation);
    addRecipient(email);
    setFrom("Support ANSUT <infoshapshap@gmail.com>");
    send(email, fullname);
  }

    public static void reset(String email, String fullname, double amount) throws EmailException {
        setContentType("text/html");
        setSubject("Paiement");
        addRecipient(email);
        setFrom("Support ANSUT <infoshapshap@gmail.com>");
        send(email, fullname, amount);
    }


    public static void code(String email, String fullname, String token) throws EmailException {
        setContentType("text/html");
        setSubject("Code d'activation");
        addRecipient(email);
        setFrom("Support ANSUT <infoshapshap@gmail.com>");
        send(email, fullname, token);
    }
    public static void password(String email, String fullname, String password) throws EmailException {
        setContentType("text/html");
        setSubject("Nouveau mot de passe");
        addRecipient(email);
        setFrom("Support ANSUT <infoshapshap@gmail.com>");
        send(email, fullname, password);
    }


}
