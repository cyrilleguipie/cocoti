package models.api;

import play.db.jpa.GenericModel;
import play.db.jpa.Model;
import play.utils.Java;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

/**
 * Handle Search
 */
public class SearchHandler<T extends Model> extends Model {

    private Class<T> modelClass;

    private final String[] SORT_DIRECTIONS = {"asc", "desc"};

    private List<String> sortDirections;

    private List<String> sortFields;

    public static final int DEFAULT_PAGINATE_COUNT = 50;
    public static final String PAGINATE_OBJECT_KEY = "objects";
    public static final String PAGINATE_COUNT_KEY = "count";

    public SearchHandler(Class<T> modelClass, List<String> sortFields) {
        this.modelClass = modelClass;
        this.sortFields = sortFields;
    }

    public List<String> getSortDirections() {
        if (sortDirections == null) {
            sortDirections = Arrays.asList(SORT_DIRECTIONS);
        }
        return sortDirections;
    }

    public List<String> getSortFields() {
        return sortFields;
    }

    public HashMap<String, Object> search(String keyword, String sortField, String sortDirection,
                                          int page, String defaultSortField) {

        if ((sortField == null) || (sortField.length() < 1)) {
            sortField = defaultSortField;
        }

        if ((sortDirection == null) || (sortDirection.length() < 1)) {
            sortDirection = "asc";
        }

        if (!getSortFields().contains(sortField)) {
            throw new IllegalArgumentException("sortField is not valid.");
        }

        if (!getSortDirections().contains(sortDirection)) {
            throw new IllegalArgumentException("sortDirection is not valid");
        }

        List<T> objects = new ArrayList<T>();
        List<Object> paramList = new ArrayList<Object>();
        StringBuilder sb = new StringBuilder();
        HashMap<String, Object> result = new HashMap<String, Object>();
        Long count;

        sb.append("id > 0");

        if ((keyword != null) && (keyword.trim().length() > 0)) {
            sb.append(" and (LOWER(").append(defaultSortField).append(") like ? ) ");
            paramList.add("%" + keyword.toLowerCase() + "%");

        }

        Object[] params = paramList.toArray(new Object[paramList.size()]);
        try {
            count = (Long) Java.invokeStatic(modelClass, "count", sb.toString(), params);

            sb.append(" order by ").append(sortField).append(" ").append(sortDirection);
            JPAQuery query = (JPAQuery) Java.invokeStatic(modelClass, "find", sb.toString(), params);
            if (page < 1) {
                page = 1;
            }
            objects = query.fetch(page, DEFAULT_PAGINATE_COUNT);

            result.put(PAGINATE_OBJECT_KEY, objects);
            result.put(PAGINATE_COUNT_KEY, count);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }
}
