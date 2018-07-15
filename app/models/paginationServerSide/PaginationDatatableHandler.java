package models.paginationServerSide;

import org.apache.commons.lang.StringUtils;
import play.db.jpa.GenericModel;
import play.db.jpa.Model;
import play.utils.Java;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Handle DataTables ServerSide Processing
 */
public class PaginationDatatableHandler<T extends Model> extends Model {

    private Class<T> modelClass;

    private int draw = 0;
    private int start = 0;
    private int length = 0;
    public static final String PAGINATE_OBJECT_KEY = "data";
    public static final String PAGINATE_ALL_RECORDS_KEY = "recordsTotal";
    public static final String PAGINATE_RECORDS_FILTERED_KEY = "recordsFiltered";
    public static final String PAGINATE_DRAW_KEY = "draw";

    public PaginationDatatableHandler(Class<T> modelClass, int draw, int start, int length) {
        this.modelClass = modelClass;
        this.draw = draw;
        this.start = start;
        this.length = length;
    }

    public HashMap<String, Object> search(String searchValue, String iSpecialParameter, Object[] vSpecialParameter,
                                          String defaultSortField, Order[] order, Column[] columns, boolean isExport) {

        String sortDirection = "";
        
        if (order != null) {
            sortDirection = order[0].getDir();
            defaultSortField = columns[order[0].getColumn()].getName();
        }

        if (defaultSortField == null || defaultSortField.length() <= 0) {
            defaultSortField = "created";
            sortDirection = "desc";
        }

        List<T> objects = new ArrayList<T>();
        List<Object> paramList = new ArrayList<Object>();
        StringBuilder sb = new StringBuilder();
        HashMap<String, Object> result = new HashMap<String, Object>();
        Long count, totalCount;
        int i = 0;

        sb.append("id > 0");

        if ((iSpecialParameter != null && iSpecialParameter.length() > 0) &&
                (vSpecialParameter != null && vSpecialParameter.length > 0)) {
            sb.append(iSpecialParameter);
            while (i < vSpecialParameter.length) {
                System.out.println(vSpecialParameter[i]);
                paramList.add(vSpecialParameter[i]);
                i++;
            }
        }

        List<String> searchQuery = new ArrayList<>();
        if ((searchValue != null) && (searchValue.trim().length() > 0)) {
            i = 0;
            while (i < columns.length) {
                if (columns[i].isSearchable()) {
                    if (columns[i].getName() != null &&
                            columns[i].getName().length() > 0) {
                        searchQuery.add(columns[i].getName() + " like ?");
                        paramList.add("%" + searchValue + "%");
                    }
                }
                i++;
            }
        }

        if (searchQuery.size() > 0) {
            String sQuery = StringUtils.join(searchQuery, " or ");
            sb.append(" and (").append(sQuery).append(")");
        }

        System.out.println(String.format("QUERY ---> %s", sb.toString()));

        Object[] params = paramList.toArray(new Object[paramList.size()]);
        try {
            count = (Long) Java.invokeStatic(modelClass, "count", sb.toString(), params);
            totalCount = (Long) Java.invokeStatic(modelClass, "count");

            sb.append(" order by ").append(defaultSortField).append(" ").append(sortDirection);
            JPAQuery query = (JPAQuery) Java.invokeStatic(modelClass, "find", sb.toString(), params);

            System.out.println(sb.toString());
            //System.out.println(params.length);
            //System.out.println(sb.toString());
            if(isExport){
                objects = query.fetch();
            } else {
                objects = query.from(start).fetch(length);
            }

            result.put(PAGINATE_OBJECT_KEY, objects);
            result.put(PAGINATE_ALL_RECORDS_KEY, totalCount);
            result.put(PAGINATE_RECORDS_FILTERED_KEY, count);
            result.put(PAGINATE_DRAW_KEY, draw);

            //System.out.println(result.size());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

}
