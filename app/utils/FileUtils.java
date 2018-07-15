package utils;

import java.io.*;
import java.util.*;


import javax.servlet.ServletContext;

public class FileUtils {

    public static final String SPLIT = ";";


    public static void write(String content, String path, boolean append) {
        try {
            FileWriter writer = new FileWriter(path, append);
            writer.write(content + "\n");

            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String read(String path) {
        String response = "";
        try {
            FileReader reader = new FileReader(path);
            BufferedReader bufferedReader = new BufferedReader(reader);

            String line;

            while ((line = bufferedReader.readLine()) != null) {
                response += line;
            }
            reader.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    public static List<String> getData(String csvFile, String first) {

        //String file = csvFile;
        BufferedReader br = null;
        String line = "";

        int i = 0;
        List<String> results = new ArrayList<String>();

        try {
            //ServletContext.
            //InputStream is = FileUtils.class.getClassLoader().getResourceAsStream("/resources/"+csvFile);
            //br = new BufferedReader(new InputStreamReader(is));

            br = new BufferedReader(new FileReader(csvFile));
            while ((line = br.readLine()) != null) {

                // use comma as separator
                String[] students = line.split(SPLIT);
                if (!students[0].contains(first)) {

                    results.add(line);
                }
            }


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        System.out.println("Done");
        return results;
    }

    public static List<String> getData(File csvFile) {

        //String file = csvFile;
        BufferedReader br = null;
        String line = "";

        int i = 0;
        List<String> results = new ArrayList<String>();

        try {

            br = new BufferedReader(new FileReader(csvFile));
            while ((line = br.readLine()) != null) {

                // use comma as separator
                String[] columns = line.split(SPLIT);
                //if (!columns[0].contains(first)) {
                results.add(line);
                //}

            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        System.out.println("Done");
        return results;
    }


    public static void write(String s) {
        try {
            FileWriter writer = new FileWriter("data.json", false);

            writer.write(s);
            writer.write("");
            writer.flush();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void write(String s, String fileName) {
        try {
            FileWriter writer = new FileWriter(fileName, false);

            writer.write(s);
            writer.write("");
            writer.flush();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static String dataFile(String file) {
        String json = null;
        try {
            json = new Scanner(new File("public/datas/" + file)).useDelimiter("\\Z").next();
        } catch (FileNotFoundException ex) {
            System.out.println(ex);
        }
        return json;
    }

    public static boolean validProductFile(String col1, String col2, String col3, String col4, String col5, String col6,
                                           String col7, String col8, String col9, String col10, String col11, String col12,
                                           String col13) {
        return (col1.equalsIgnoreCase("title") && col2.equalsIgnoreCase("barcode")
                && col3.equalsIgnoreCase("productCode") && col4.equalsIgnoreCase("categorie") && col5.equalsIgnoreCase("format")
                && col6.equalsIgnoreCase("formatProduct") && col7.equalsIgnoreCase("quantityUnitByCarton") && col8.equalsIgnoreCase("CartonPrice")
                && col9.equalsIgnoreCase("UnitPrice") && col10.equalsIgnoreCase("ItemId") && col11.equalsIgnoreCase("SaleByLot")
                && col12.equalsIgnoreCase("halfPrice") && col13.equalsIgnoreCase("wholePrice"));
    }
}

