package models.paginationServerSide;

/**
 * Created by ROMUALD on 18/09/2017.
 */
public class Search {

    private String value;

    private boolean regex;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isRegex() {
        return regex;
    }

    public void setRegex(boolean regex) {
        this.regex = regex;
    }
}
