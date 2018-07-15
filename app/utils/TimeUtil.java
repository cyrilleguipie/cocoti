package utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by ROMUALD on 03/01/2017.
 */
public class TimeUtil {

  private static final String PATTERN = "dd/MM/yyyy";

  public static boolean compareDate(Date startDate, Date endDate, Date now) {
    Calendar date = Calendar.getInstance();
    Calendar cStartDate = Calendar.getInstance();
    Calendar cEndDate = Calendar.getInstance();
    date.setTime(now);
    cStartDate.setTime(startDate);
    cEndDate.setTime(endDate);

    return date.after(cStartDate) && date.before(cEndDate);
  }

  public static long getDifferenceDays(Date d1, Date d2) {
    long diff = d2.getTime() - d1.getTime();
    return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
  }

  public static Date parseDate(String value) throws ParseException {
    DateFormat formatter = new SimpleDateFormat(PATTERN);
    return formatter.parse(value);
  }

  public static Date parseDate(String value, String pattern) throws ParseException {
    DateFormat formatter = new SimpleDateFormat(pattern);
    return formatter.parse(value);
  }

  public static String formatDate(Date value) throws ParseException {
    DateFormat formatter = new SimpleDateFormat(PATTERN);
    return formatter.format(value);
  }


  public static Date getStartAndEndOfDate(Date date) throws ParseException {
    String dateString = formatDate(date);
    return parseDate(dateString);
  }


  public static List<Date> getFirstDateAndLastDateOfCurrentMonth(Calendar cal) {
    List<Date> _dates = new ArrayList<>();
    cal.add(Calendar.MONTH, 0);
    cal.set(Calendar.DATE, 1);
    _dates.add(cal.getTime());
    cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
    _dates.add(cal.getTime());
    return _dates;
  }

  public static List<Date> getLastWeekStartDateAndNextWeekEndDateOfCurrentMonth(Calendar cal) {
    List<Date> _dates = new ArrayList<>();

    //cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
    //cal.add(Calendar.WEEK_OF_YEAR, -1);
    cal.add(Calendar.DATE, -7);

    _dates.add(cal.getTime());

    System.out.println("FIRST DATE --> "+ cal.getTime().toString());

    cal = Calendar.getInstance();
    cal.add(Calendar.DATE, 6);
    //cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
    //cal.add(Calendar.WEEK_OF_YEAR, 1);
    //cal.add(Calendar.DATE, 6);

    _dates.add(cal.getTime());

    System.out.println("END DATE --> "+ cal.getTime().toString());
    return _dates;
  }

  public static void test() {
    Calendar c = GregorianCalendar.getInstance(Locale.FRANCE);
    // Set the calendar to monday of the current week
    c.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
    // Print dates of the current week starting on Monday
    DateFormat df = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
    String startDate = "", endDate = "";

/*  startDate = df.format(c.getTime());
    c.add(Calendar.DATE, 6);
    endDate = df.format(c.getTime());

    System.out.println("Current Week Start Date = " + startDate);
    System.out.println("Current Week End Date = " + endDate);*/

    c.add(Calendar.WEEK_OF_YEAR, -1);
    startDate = df.format(c.getTime());
    c.add(Calendar.DATE, 6);
    endDate = df.format(c.getTime());

    System.out.println("Last Week Start Date = " + startDate);
    System.out.println("Last Week End Date = " + endDate);

    //c = Calendar.getInstance();
    //c.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
    c.add(Calendar.WEEK_OF_YEAR, 1);
    startDate = df.format(c.getTime());
    c.add(Calendar.DATE, 6);
    endDate = df.format(c.getTime());

    System.out.println("Next Week Start Date = " + startDate);
    System.out.println("Next Week End Date = " + endDate);
  }

  public static Calendar getCalendarByMonth(Calendar calendar, int month) {
    switch (month) {
      case 0:
        calendar.set(Calendar.MONTH, Calendar.JANUARY);
        break;
      case 1:
        calendar.set(Calendar.MONTH, Calendar.FEBRUARY);
        break;
      case 2:
        calendar.set(Calendar.MONTH, Calendar.MARCH);
        break;
      case 3:
        calendar.set(Calendar.MONTH, Calendar.APRIL);
        break;
      case 4:
        calendar.set(Calendar.MONTH, Calendar.MAY);
        break;
      case 5:
        calendar.set(Calendar.MONTH, Calendar.JUNE);
        break;
      case 6:
        calendar.set(Calendar.MONTH, Calendar.JULY);
        break;
      case 7:
        calendar.set(Calendar.MONTH, Calendar.AUGUST);
        break;
      case 8:
        calendar.set(Calendar.MONTH, Calendar.SEPTEMBER);
        break;
      case 9:
        calendar.set(Calendar.MONTH, Calendar.OCTOBER);
        break;
      case 10:
        calendar.set(Calendar.MONTH, Calendar.NOVEMBER);
        break;
      case 11:
        calendar.set(Calendar.MONTH, Calendar.DECEMBER);
        break;
      default:
        break;
    }
    return calendar;
  }
}
