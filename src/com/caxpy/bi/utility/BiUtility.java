package com.caxpy.bi.utility;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.MapListHandler;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caxpy.bi.db.DBUtils;
import com.caxpy.bi.db.H2Db;
import com.caxpy.bi.model.CaxpyReport;

// TODO: Auto-generated Javadoc
/**
 * This utility class will be responsible for executing all our queries.
 *
 * @author Mthukkaram
 */
public class BiUtility {

	/** The log. */
	private static Logger log = Logger.getLogger(BiUtility.class.getName());
	
	/** The errormsg. */
	public static String errormsg= "";
	
	/**
	 * Gets the response.
	 *
	 * @param query the query
	 * @param db the db
	 * @return the response
	 */
	public static List<Map<String, Object>> getResponse(String query,String db) {
		QueryRunner run = new QueryRunner();
		Connection conn = null;
		List<Map<String, Object>> maps = null;
		try {
			conn = DBUtils.getDBConnection(db);
			maps = run.query(conn, query, new MapListHandler());
		} catch (Exception e) {
			errormsg = e.getMessage();
			log.error(e);
		} finally {
			try {
				if(conn!=null){
					conn.close();
				}
			} catch (SQLException e) {
				log.error(e);
			}
		}
		return maps;
	}

	/**
	 * Gets the JSON array.
	 *
	 * @param maps the maps
	 * @return the JSON array
	 */
	public static JSONArray getJSONArray(List<Map<String, Object>> maps) {
		JSONArray array = null;
		try {
			array = new JSONArray(maps.toString());
		} catch (JSONException e) {
			log.error(e);
		}
		return array;
	}

	/**
	 * Get all the report from the report location.
	 *
	 * @return table names in the form of array
	 */
	public static JSONArray getReports() {
		return H2Db.getReports();
	}
	
	/**
	 * Valid format is 1111-ProgmarXYZ.
	 *
	 * @param report_name the report_name
	 * @return true, if is valid report name
	 */
	public static boolean isValidReportName(String report_name){
		if(report_name.contains("-") && isLong(report_name.split("-")[0])){
			return true;
		}
		return false;
	}
	
	/**
	 * Check if the number is a long.
	 *
	 * @param longval the longval
	 * @return true, if is long
	 */
	public static boolean isLong(String longval) {
		try{
			Long.parseLong(longval);//if this is fine return true
			return true;
		}catch(NumberFormatException ex){
			log.error(ex);
		}
		return false;
	}
	
	/**
	 * Save report.
	 *
	 * @param report the report
	 * @param groupid 
	 * @return the string
	 */
	public static String saveReport(String report, int groupid) {
		String report_name = null;
		boolean newReport = false;
		long report_id = System.currentTimeMillis();
		try {
			JSONObject obj = new JSONObject(report);
			report_name = obj.getString("report_name");
			if(!isValidReportName(report_name)){
				newReport = true;
				report_name = report_id+"-"+ StringEscapeUtils.escapeHtml(obj.getString("report_name"));
				//rename the report with new value
				obj.put("report_name", report_name);
				obj.put("report_id", report_id);
				report = obj.toString();
			}else{
				//its an old report
				report_id = obj.getLong("report_id");
			}
		} catch (JSONException e1) {
			log.error(e1);
			return null;//why proceed!
		}
		CaxpyReport rep = new CaxpyReport();
		rep.setReportid(report_id);
		rep.setReportjson(report);
		rep.setReportname(report_name);
		rep.setGroupid(groupid);
		if(!newReport){
			H2Db.saveReport(rep);
		}else{
			H2Db.saveAsReport(rep);
		}
		return report_name;
	}

	/**
	 * Gets the report id.
	 *
	 * @param reportname the reportname
	 * @return the report id
	 */
	public static long getReportId(String reportname){
		if(isLong(reportname)){
			return Long.parseLong(reportname);
		}
		return Long.parseLong(reportname.split("-")[0]);
	}
	
	/**
	 * Get file data by reading it from the file.
	 *
	 * @param reportid the reportid
	 * @return null if the file doesnt exist else the file contents
	 */
	public static String getReport(String reportid) {
		return H2Db.getReportJson(BiUtility.getReportId(reportid),null);
	}

	/**
	 * Delete report.
	 *
	 * @param reportid the reportid
	 */
	public static void deleteReport(long reportid) {
		H2Db.deleteReport(reportid);
	}

//	public static void main(String[] args) {
//		getColumns("agg_c_10_sales_fact_1997");
//	}
}
