package models.exceptions;

public class ObjectHasChildrenException extends Exception {

    public ObjectHasChildrenException() {
        super();
    }

    public ObjectHasChildrenException(String message, Throwable throwable) {
        super(message, throwable);
    }

    public ObjectHasChildrenException(String message) {
        super(message);
    }

    public ObjectHasChildrenException(Throwable message) {
        super(message);
    }

    
}
