package models.paginationServerSide;

/**
 * Created by ROMUALD on 18/09/2017.
 */
public class Order {

    private int column;

    private String dir;

    public int getColumn() {
        return column;
    }

    public void setColumn(int column) {
        this.column = column;
    }

    public String getDir() {
        return dir;
    }

    public void setDir(String dir) {
        this.dir = dir;
    }
}
