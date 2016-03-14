package com.caxpy.bi.utility;

import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caxpy.bi.db.H2Db;

public class BiUtilityTest extends TestCase {
	int goupid = 0;
	
	/**
	 * First Method to be called
	 */
	public void testinitialize(){
		H2Db.DB = "caxpytest";
		H2Db.initCaxpyDB();
		assertTrue(true);
	}
	
	public void testgetResponse() throws JSONException {
		List<Map<String, Object>> response = BiUtility
				.getResponse("SELECT product_family, sum( store_sales) as store_sales FROM `foodmart`.`agg_g_ms_pcat_sales_fact_1997` group by product_family","mysql-foodmart");
		JSONArray jsonArray = BiUtility.getJSONArray(response);
		assertEquals(
				"[{\"store_sales\":48836.21,\"product_family\":\"Drink\"},{\"store_sales\":409035.59,\"product_family\":\"Food\"},{\"store_sales\":107366.33,\"product_family\":\"Non-Consumable\"}]",
				jsonArray.toString());
	}

	public void testgetResponse_1() {
		String query = "SELECT product_family, sum( store_sales) as store_sales FROM `foodmart`.`agg_g_ms_pcat_sales_fact_1997` group by product_family";
		List<Map<String, Object>> response = BiUtility.getResponse(query,"mysql-foodmart");
		assertEquals(
				"[{product_family=Drink, store_sales=48836.2100}, {product_family=Food, store_sales=409035.5900}, {product_family=Non-Consumable, store_sales=107366.3300}]",
				response.toString());
	}

	public void testValidname() {
		String invalidname = "asdflasdfasdfasd-asdfasdf";
		String validname = "1111-asdfaksdfasdfadsf";
		assertFalse(BiUtility.isValidReportName(invalidname));
		assertTrue(BiUtility.isValidReportName(validname));
	}

	public void testSave() {
		String reportdata = "{\"query\":\"select (select programname from tbl_training_programs_6 where tts.trainingprogramid=id) as programname,costofprogram from tbl_training_schedule_6 as tts \",\"chartData\":[{\"programname\":\"Art of Living\",\"costofprogram\":1234},{\"programname\":\"Test\",\"costofprogram\":2000},{\"programname\":\"Test\",\"costofprogram\":50000},{\"programname\":\"Dot Net\",\"costofprogram\":50000},{\"programname\":\"Art of Living\",\"costofprogram\":10000},{\"programname\":\"Dot Net\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":200000},{\"programname\":\"SAP\",\"costofprogram\":100000}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"Program Cost Chart\",\"chart_rows\":[\"costofprogram\"],\"chart_cols\":[\"programname\"], \"connection\" : \"mysql-foodmart\" , \"query_colums\":[\"programname\",\"costofprogram\"]}";
		try {
			JSONObject obj = new JSONObject(reportdata);
			String old_report_name = obj.getString("report_name");
			assertFalse(BiUtility.isValidReportName(old_report_name));
			int goupid = 0;
			//save first
			String savedReportName = BiUtility.saveReport(reportdata,goupid);
			assertTrue(BiUtility.isValidReportName(savedReportName));
			String report = BiUtility.getReport(savedReportName);
			
			//save second
			String repname1 = BiUtility.saveReport(report,goupid);
			assertEquals(savedReportName, repname1);
			//save third
			String repname2 = BiUtility.saveReport(report,goupid);
			assertEquals(savedReportName, repname2);
			
			//save fourth
			String repname3 = BiUtility.saveReport(report,goupid);
			assertEquals(savedReportName, repname3);
			
		} catch (Exception e) {
			e.printStackTrace();
			assertTrue(false);
		}
	}

	public void testSaveAs() {
		String reportdata = "{\"query\":\"select (select programname from tbl_training_programs_6 where tts.trainingprogramid=id) as programname,costofprogram from tbl_training_schedule_6 as tts \",\"chartData\":[{\"programname\":\"Art of Living\",\"costofprogram\":1234},{\"programname\":\"Test\",\"costofprogram\":2000},{\"programname\":\"Test\",\"costofprogram\":50000},{\"programname\":\"Dot Net\",\"costofprogram\":50000},{\"programname\":\"Art of Living\",\"costofprogram\":10000},{\"programname\":\"Dot Net\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":200000},{\"programname\":\"SAP\",\"costofprogram\":100000}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"Program Cost Chart\",\"chart_rows\":[\"costofprogram\"],\"chart_cols\":[\"programname\"],\"connection\" : \"mysql-foodmart\" ,\"query_colums\":[\"programname\",\"costofprogram\"]}";
		try {
			JSONObject obj = new JSONObject(reportdata);
			String report_name = obj.getString("report_name");
			int goupid = 0;
			assertFalse(BiUtility.isValidReportName(report_name));
			String saveReport = BiUtility.saveReport(reportdata,goupid);
			assertTrue(BiUtility.isValidReportName(saveReport));
			String report = BiUtility.getReport(saveReport);
			JSONObject obj2 = new JSONObject(report);
			report_name = obj2.getString("report_name");
			assertEquals(saveReport, report_name);
			assertNotNull(report);
		} catch (JSONException e1) {
			assertTrue(false);
		}

	}

	public void testDelete() {
		String reportdata3 = "{\"query\":\"select (select programname from tbl_training_programs_6 where tts.trainingprogramid=id) as programname,costofprogram from tbl_training_schedule_6 as tts \",\"chartData\":[{\"programname\":\"Art of Living\",\"costofprogram\":1234},{\"programname\":\"Test\",\"costofprogram\":2000},{\"programname\":\"Test\",\"costofprogram\":50000},{\"programname\":\"Dot Net\",\"costofprogram\":50000},{\"programname\":\"Art of Living\",\"costofprogram\":10000},{\"programname\":\"Dot Net\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":200000},{\"programname\":\"SAP\",\"costofprogram\":100000}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"Program Cost Chart 2\",\"chart_rows\":[\"costofprogram\"],\"chart_cols\":[\"programname\"],\"connection\" : \"mysql-foodmart\" ,\"query_colums\":[\"programname\",\"costofprogram\"]}";
		String saveReport = BiUtility.saveReport(reportdata3,goupid);
		assertNotNull(saveReport);
		BiUtility.deleteReport(BiUtility.getReportId(saveReport));
		String report = BiUtility.getReport(saveReport);
		assertNull(report);
	}
	
	public void testInvalidConditions(){
		String wrongreportname = "0-report";
		String report = BiUtility.getReport(wrongreportname);
		assertNull(report);
		
		//invalid json test
		String reportdata3 = "{\"query\"=\"select (select programname from tbl_training_programs_6 where tts.trainingprogramid=id) as programname,costofprogram from tbl_training_schedule_6 as tts \",\"chartData\":[{\"programname\":\"Art of Living\",\"costofprogram\":1234},{\"programname\":\"Test\",\"costofprogram\":2000},{\"programname\":\"Test\",\"costofprogram\":50000},{\"programname\":\"Dot Net\",\"costofprogram\":50000},{\"programname\":\"Art of Living\",\"costofprogram\":10000},{\"programname\":\"Dot Net\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":100000},{\"programname\":\"SAP\",\"costofprogram\":200000},{\"programname\":\"SAP\",\"costofprogram\":100000}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"Program Cost Chart 2\",\"chart_rows\":[\"costofprogram\"],\"chart_cols\":[\"programname\"],\"connection\" : \"mysql-foodmart\" ,\"query_colums\":[\"programname\",\"costofprogram\"]}";
		String saveReport = BiUtility.saveReport(reportdata3,goupid);
		assertNotNull(saveReport);
	}
	
	public void testgetReportId(){
		String reportname = "1418729340556-Sales Report by Product Deparment";
		long reportId = BiUtility.getReportId(reportname);
		long expected = 1418729340556l;
		assertEquals(expected,reportId);
		
		reportname = "1418729340556";
		reportId = BiUtility.getReportId(reportname);
		assertEquals(expected,reportId);
	}
	
	public void testGetreportjson() throws JSONException{
		String report = "{\"query\":\"SELECT c.fullname,c.city, sum(a.store_sales) as 'Store Sales', sum(a.fact_count) as 'Fact Count'  FROM  agg_l_03_sales_fact_1997 a, customer c where a.customer_id= c.customer_id group by a.customer_id limit 50\",\"chartData\":[{\"fullname\":\"Jeanne Derry\",\"city\":\"Issaquah\",\"Store Sales\":98.54,\"Fact Count\":17},{\"fullname\":\"Maya Gutierrez\",\"city\":\"Novato\",\"Store Sales\":1.08,\"Fact Count\":1},{\"fullname\":\"Robert Damstra\",\"city\":\"Lynnwood\",\"Store Sales\":65.76,\"Fact Count\":6},{\"fullname\":\"Darren Stanz\",\"city\":\"Lake Oswego\",\"Store Sales\":53.82,\"Fact Count\":9},{\"fullname\":\"Bryan Rutledge\",\"city\":\"Lincoln Acres\",\"Store Sales\":9.14,\"Fact Count\":3},{\"fullname\":\"Brenda Marshall\",\"city\":\"Arcadia\",\"Store Sales\":50.17,\"Fact Count\":8},{\"fullname\":\"Dianne Collins\",\"city\":\"Oakland\",\"Store Sales\":13.37,\"Fact Count\":5},{\"fullname\":\"Beverly Baker\",\"city\":\"Spring Valley\",\"Store Sales\":57.46,\"Fact Count\":10},{\"fullname\":\"Pedro Castillo\",\"city\":\"Renton\",\"Store Sales\":4.6,\"Fact Count\":1},{\"fullname\":\"Shauna Wyro\",\"city\":\"La Jolla\",\"Store Sales\":28.46,\"Fact Count\":3},{\"fullname\":\"Jose Bernard\",\"city\":\"Burbank\",\"Store Sales\":35.65,\"Fact Count\":5},{\"fullname\":\"Lois Wood\",\"city\":\"Everett\",\"Store Sales\":62.06,\"Fact Count\":9},{\"fullname\":\"Cody Goldey\",\"city\":\"Milwaukie\",\"Store Sales\":105.93,\"Fact Count\":15},{\"fullname\":\"Donna Arnold\",\"city\":\"Oregon City\",\"Store Sales\":80.99,\"Fact Count\":13},{\"fullname\":\"Jessica Olguin\",\"city\":\"Lebanon\",\"Store Sales\":241.77,\"Fact Count\":30},{\"fullname\":\"Phyllis Burchett\",\"city\":\"Santa Cruz\",\"Store Sales\":21.86,\"Fact Count\":7},{\"fullname\":\"Howard Bechard\",\"city\":\"W. Linn\",\"Store Sales\":100.58,\"Fact Count\":13},{\"fullname\":\"Juanita Sharp\",\"city\":\"Burbank\",\"Store Sales\":65.17,\"Fact Count\":9},{\"fullname\":\"Sandra Brunner\",\"city\":\"Bellflower\",\"Store Sales\":197.8,\"Fact Count\":31},{\"fullname\":\"Ernest Staton\",\"city\":\"Renton\",\"Store Sales\":81.2,\"Fact Count\":12},{\"fullname\":\"Terri Burke\",\"city\":\"Arcadia\",\"Store Sales\":77.96,\"Fact Count\":16},{\"fullname\":\"Audrey Osborn\",\"city\":\"Altadena\",\"Store Sales\":55.53,\"Fact Count\":10},{\"fullname\":\"Gary Dumin\",\"city\":\"Grossmont\",\"Store Sales\":53.9,\"Fact Count\":11},{\"fullname\":\"Pat Chin\",\"city\":\"Imperial Beach\",\"Store Sales\":33.26,\"Fact Count\":5},{\"fullname\":\"Mary Borden\",\"city\":\"Santa Monica\",\"Store Sales\":24.87,\"Fact Count\":3},{\"fullname\":\"Clayton Harris\",\"city\":\"Beaverton\",\"Store Sales\":47.46,\"Fact Count\":9},{\"fullname\":\"Julie Walker\",\"city\":\"Ballard\",\"Store Sales\":43.07,\"Fact Count\":6},{\"fullname\":\"Gayle Winfrey\",\"city\":\"Port Orchard\",\"Store Sales\":273.11,\"Fact Count\":48},{\"fullname\":\"Yasmina Brown\",\"city\":\"Downey\",\"Store Sales\":55.51,\"Fact Count\":9},{\"fullname\":\"Mary Bakhtyari\",\"city\":\"Tacoma\",\"Store Sales\":116.15,\"Fact Count\":20},{\"fullname\":\"Melvin Glass\",\"city\":\"Lemon Grove\",\"Store Sales\":83.06,\"Fact Count\":12},{\"fullname\":\"Kristin Cohen\",\"city\":\"Milwaukie\",\"Store Sales\":37.73,\"Fact Count\":7},{\"fullname\":\"Gabriel Walton\",\"city\":\"Milwaukie\",\"Store Sales\":53.99,\"Fact Count\":11},{\"fullname\":\"Bishop Meastas\",\"city\":\"Woodland Hills\",\"Store Sales\":97.27,\"Fact Count\":11},{\"fullname\":\"Tricia Clark\",\"city\":\"Long Beach\",\"Store Sales\":102.7,\"Fact Count\":18},{\"fullname\":\"Patricia Goldberg\",\"city\":\"Woodburn\",\"Store Sales\":121.73,\"Fact Count\":18},{\"fullname\":\"Rhonda Mehlert\",\"city\":\"Beaverton\",\"Store Sales\":43.57,\"Fact Count\":7},{\"fullname\":\"Elizabeth Horne\",\"city\":\"Port Orchard\",\"Store Sales\":340.74,\"Fact Count\":46},{\"fullname\":\"Sylvester Valdez\",\"city\":\"National City\",\"Store Sales\":17.84,\"Fact Count\":3},{\"fullname\":\"John Stewart\",\"city\":\"Long Beach\",\"Store Sales\":142.65,\"Fact Count\":13},{\"fullname\":\"Josie Underwood\",\"city\":\"West Covina\",\"Store Sales\":30.73,\"Fact Count\":7},{\"fullname\":\"Pat Azari\",\"city\":\"Santa Monica\",\"Store Sales\":65.01,\"Fact Count\":10},{\"fullname\":\"Gina Saxton\",\"city\":\"Altadena\",\"Store Sales\":136.28,\"Fact Count\":26},{\"fullname\":\"Carol Eyster\",\"city\":\"Albany\",\"Store Sales\":101.85,\"Fact Count\":14},{\"fullname\":\"Nancy Henry\",\"city\":\"Bremerton\",\"Store Sales\":137.03,\"Fact Count\":20},{\"fullname\":\"Christopher Groome\",\"city\":\"Milwaukie\",\"Store Sales\":62.35,\"Fact Count\":8},{\"fullname\":\"Anna Hill\",\"city\":\"Santa Monica\",\"Store Sales\":61.03,\"Fact Count\":8},{\"fullname\":\"Ellen Gray\",\"city\":\"Bellflower\",\"Store Sales\":27.64,\"Fact Count\":5},{\"fullname\":\"Henry Fielder\",\"city\":\"Ballard\",\"Store Sales\":45.13,\"Fact Count\":4},{\"fullname\":\"Jeanine Finnell\",\"city\":\"Everett\",\"Store Sales\":54.68,\"Fact Count\":7}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"customer sales\",\"chart_rows\":[\"Store Sales\",\"Fact Count\"],\"rawData\":[],\"chart_cols\":[\"fullname\",\"city\"],\"query_colums\":[\"fullname\",\"city\",\"Store Sales\",\"Fact Count\"],\"report_id\":\"\",\"connection\":\"mysql-foodmart\",\"query_params\":[],\"realtime\":false,\"chartProperties\":{\"xtitle\":\"Customers full name\",\"cache\":\"on\",\"chartTitle\":\"Customer sales data\",\"ytitle\":\"Store Sales\",\"chartSubTitle\":\"Data from 1997 foodmart sales data\"}}";
		String savedReportName = BiUtility.saveReport(report,goupid);
		String reportJson = ReportUtility.getReportJson(BiUtility.getReportId(savedReportName),null);
		JSONObject obj2 = new JSONObject(reportJson);
		long long1 = obj2.getLong("report_id");
		String reportJson2 = ReportUtility.getReportJson(long1,null);
		assertEquals(reportJson2, reportJson);
	}
	
	public void testGetReportJSONWithParameters(){
		String report = "{\"query\":\"select customer_id, sum(store_sales) from agg_lc_100_sales_fact_1997 where quarter='<q>' group by customer_id limit 20\",\"chartData\":[{\"customer_id\":5,\"sum(store_sales)\":1.08},{\"customer_id\":10,\"sum(store_sales)\":38.7},{\"customer_id\":20,\"sum(store_sales)\":24.86},{\"customer_id\":21,\"sum(store_sales)\":4.6},{\"customer_id\":23,\"sum(store_sales)\":28.46},{\"customer_id\":28,\"sum(store_sales)\":33.53},{\"customer_id\":30,\"sum(store_sales)\":28.76},{\"customer_id\":39,\"sum(store_sales)\":8.43},{\"customer_id\":41,\"sum(store_sales)\":46.01},{\"customer_id\":43,\"sum(store_sales)\":31.99},{\"customer_id\":45,\"sum(store_sales)\":41.81},{\"customer_id\":49,\"sum(store_sales)\":17.76},{\"customer_id\":55,\"sum(store_sales)\":31.11},{\"customer_id\":64,\"sum(store_sales)\":47.46},{\"customer_id\":74,\"sum(store_sales)\":18.03},{\"customer_id\":76,\"sum(store_sales)\":83.62},{\"customer_id\":77,\"sum(store_sales)\":47.03},{\"customer_id\":79,\"sum(store_sales)\":29.33},{\"customer_id\":80,\"sum(store_sales)\":46.86},{\"customer_id\":81,\"sum(store_sales)\":17.94}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"quater test\",\"chart_rows\":[\"sum(store_sales)\"],\"rawData\":[],\"chart_cols\":[\"customer_id\"],\"query_colums\":[\"customer_id\",\"sum(store_sales)\"],\"report_id\":\"\",\"connection\":\"mysql-foodmart\",\"query_params\":[{\"name\":\"q\",\"value\":\"Q1\"}],\"realtime\":false,\"chartProperties\":{\"xtitle\":\"Customers\",\"cache\":\"\",\"chartTitle\":\"\",\"chartSubTitle\":\"\",\"ytitle\":\"Sum of Store Sales\"}}";
		String savedReportName = BiUtility.saveReport(report,goupid);
		long reportId = BiUtility.getReportId(savedReportName);
		String reportJson1 = ReportUtility.getReportJson(reportId,"[{\"name\":\"q\",\"value\":\"Q1\"}]");
		String reportJson2 = ReportUtility.getReportJson(reportId,"[{\"name\":\"q\",\"value\":\"Q2\"}]");
		assertNotSame(reportJson1, reportJson2);
	}
	
}
