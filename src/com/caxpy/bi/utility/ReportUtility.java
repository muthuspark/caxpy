package com.caxpy.bi.utility;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caxpy.bi.db.H2Db;

public class ReportUtility {
	private static Logger log = Logger.getLogger(ReportUtility.class.getName());

//	public static String getReportJson(String reportid) {
//		String res = "";
//		String reportLocation = PropertyUtil.getReportLocation();
//		File file = new File(reportLocation);
//		String[] list = file.list();
//		for (String filename : list) {
//			if (filename.startsWith(reportid)) {
//				File rfile = new File(reportLocation, filename);
//				try {
//					String reportJson = FileUtils.readFileToString(rfile);
//					res = getChart(reportJson);
//				} catch (JSONException | IOException e) {
//					log.error(e);
//				}
//				break;
//			}
//		}
//		return res;
//	}
	
	public static String getReportJson(long reportid,String params) {
		return H2Db.getReportJson(reportid,params);
	}

	/**
	 * Get the data refreshed from the database
	 * 
	 * @param params
	 * @param reportJson
	 * @return
	 * @throws JSONException
	 */
	public static String refreshJsonDataUsingParams(String reportJson, String params)
			throws JSONException {
		String res = "";
		if(reportJson!=null){
			JSONObject reportjsonobj = new JSONObject(reportJson);
			String myquery = reportjsonobj.get("query").toString();
			if(params!=null){
				JSONArray qar = new JSONArray(params);
				for(int i=0;i<qar.length();i++){
					JSONObject object = (JSONObject) qar.get(i);
					myquery = myquery.replaceAll("<"+object.get("name").toString()+">",object.get("value").toString());
				}
			}
			//execute the query
			List<Map<String, Object>> response = BiUtility.getResponse(myquery, reportjsonobj.get("connection").toString());
			JSONArray arr = new JSONArray(response);
			reportjsonobj.put("chartData",arr);
			res = reportjsonobj.toString();
		}
		return res;
	}
	
	/**
	 * Get the data refreshed from the database
	 * 
	 * @param params
	 * @param reportJson
	 * @return
	 * @throws JSONException
	 */
	public static String refreshJsonData(String reportJson,String params)
			throws JSONException {
		JSONObject reportjsonobj = new JSONObject(reportJson);
		if(reportjsonobj.has("connectionType")){
			String connectionType = reportjsonobj.get("connectionType").toString();
			if(connectionType.equalsIgnoreCase(CaxpyConstants.CSV.getValue())){
				return reportJson;
			}else if(connectionType.equals("null") || connectionType.equalsIgnoreCase(CaxpyConstants.SQL.getValue())){
				if(params==null){
					if(reportjsonobj.has("query_params")){
						params = reportjsonobj.get("query_params").toString();
					}
				}
				return refreshJsonDataUsingParams(reportJson,params);
			}
		}else{
			if(params==null){
				if(reportjsonobj.has("query_params")){
					params = reportjsonobj.get("query_params").toString();
				}
			}
			return refreshJsonDataUsingParams(reportJson,params);
		}
		return reportJson;
	}
	
//	public static String moveReportsToDB() throws Exception {
//		String res = "";
//		String reportLocation = PropertyUtil.getReportLocation();
//		File file = new File(reportLocation);
//		String[] list = file.list();
//		JdbcConnectionPool connection = H2Db.getConnection();
//		Connection con = connection.getConnection();
//		PreparedStatement prep = con
//				.prepareStatement("INSERT INTO reports (reportid, reportname, reportjson) VALUES (?,?,?)");
//		for (String filename : list) {
//			File rfile = new File(reportLocation, filename);
//			String reportJson = FileUtils.readFileToString(rfile);
//			InputStream stream = new ByteArrayInputStream(reportJson.getBytes(StandardCharsets.UTF_8));
//			prep.setLong(1,Long.parseLong(filename.split("-")[0]));
//			prep.setString(2,filename.split("-")[1]);
//			Reader r = new InputStreamReader(stream);
//			prep.setClob(3, r);
//			prep.addBatch();
//		}
//		con.setAutoCommit(false);
//		prep.executeBatch();
//		con.setAutoCommit(true);
//
//		return res;
//	}

//	public static void main(String[] args) throws Exception {
//		moveReportsToDB();
//	}

}
