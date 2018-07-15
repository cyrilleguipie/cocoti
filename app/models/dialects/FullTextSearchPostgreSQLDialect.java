package models.dialects;

import java.util.List;

import org.hibernate.QueryException;
import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.dialect.function.SQLFunction;
import org.hibernate.engine.Mapping;
import org.hibernate.engine.SessionFactoryImplementor;
import org.hibernate.type.BooleanType;
import org.hibernate.type.Type;

import play.Logger;

public class FullTextSearchPostgreSQLDialect extends PostgreSQLDialect {

    public FullTextSearchPostgreSQLDialect() {
        registerFunction("fts", new FullTextSearchPostgreSQLFunction());
    }

    public class FullTextSearchPostgreSQLFunction implements SQLFunction {

        @Override
        @SuppressWarnings("unchecked")
        public String render(Type type, List args, SessionFactoryImplementor factory) throws QueryException {
            if (args.size() != 1) {
                throw new IllegalArgumentException("The function must be passed 1 argument");
            }
            String values = (String) args.get(0);
            return "searchable_text @@ to_tsquery('pg_catalog.french', " + values + ")";
        }

        @Override
        public Type getReturnType(Type columnType, Mapping mapping) throws QueryException {
            return new BooleanType();
        }

        @Override
        public boolean hasArguments() {
            return true;
        }

        @Override
        public boolean hasParenthesesIfNoArguments() {
            return false;
        }
    }
}
