package com.caxpy.bi.utility;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.Response;

import junit.framework.TestCase;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Assert;

import com.caxpy.bi.db.H2Db;
import com.caxpy.bi.model.CaxpyConnection;
import com.caxpy.bi.rest.DataService;

public class DataServiceTest extends TestCase {

	/**
	 * First Method to be called
	 */
	public void testinitialize() {
		H2Db.DB = "caxpytest";
		H2Db.initCaxpyDB();
		assertTrue(true);
	}

	public void testGoodQuery() {
		String query = "SELECT product_department, sum(store_sales) as store_sales,  sum(store_cost) as store_cost FROM agg_g_ms_pcat_sales_fact_1997 group by product_department";
		Response executeQuery = new DataService().executeQuery(query,
				"mysql-foodmart");
		Assert.assertEquals(200, executeQuery.getStatus());
		assertEquals(
				"[{product_department=Alcoholic Beverages, store_sales=14029.0800, store_cost=5576.7852}, {product_department=Baked Goods, store_sales=16455.4300, store_cost=6564.0919}, {product_department=Baking Goods, store_sales=38670.4100, store_cost=15370.6101}, {product_department=Beverages, store_sales=27748.5300, store_cost=11069.5302}, {product_department=Breakfast Foods, store_sales=6941.4600, store_cost=2756.7966}, {product_department=Canned Foods, store_sales=39774.3400, store_cost=15894.5335}, {product_department=Canned Products, store_sales=3314.5200, store_cost=1317.1313}, {product_department=Carousel, store_sales=1500.1100, store_cost=595.9680}, {product_department=Checkout, store_sales=3767.7100, store_cost=1525.0365}, {product_department=Dairy, store_sales=37567.4500, store_cost=15059.7701}, {product_department=Deli, store_sales=25318.9300, store_cost=10108.8701}, {product_department=Eggs, store_sales=9200.7600, store_cost=3684.9006}, {product_department=Frozen Foods, store_sales=55207.5000, store_cost=22030.6587}, {product_department=Health and Hygiene, store_sales=32571.8600, store_cost=12972.9863}, {product_department=Household, store_sales=60469.8900, store_cost=24170.7324}, {product_department=Meat, store_sales=3669.8900, store_cost=1465.4216}, {product_department=Periodicals, store_sales=9056.7600, store_cost=3614.5523}, {product_department=Produce, store_sales=82248.4200, store_cost=32831.3310}, {product_department=Seafood, store_sales=3809.1400, store_cost=1520.6984}, {product_department=Snack Foods, store_sales=67609.8200, store_cost=26963.3406}, {product_department=Snacks, store_sales=14550.0500, store_cost=5827.5830}, {product_department=Starchy Foods, store_sales=11756.0700, store_cost=4705.9052}]",
				executeQuery.getEntity().toString());
	}

	public void testBadQuery() {
		String query = "SELECT product_department, sum(store_sales1) as store_sales,  sum(store_cost) as store_cost FROM agg_g_ms_pcat_sales_fact_1997";
		Response executeQuery = new DataService().executeQuery(query,
				"mysql-foodmart");
		Assert.assertEquals(500, executeQuery.getStatus());
	}

	public void testgetReports() {
		Response executeQuery = new DataService().getReports();

		Assert.assertEquals(200, executeQuery.getStatus());
	}

	public void testSavereport() throws Exception {
		String reportdate = "{\"query\":\"select product_department,sum(customer_count) as customer_count  from agg_g_ms_pcat_sales_fact_1997 group by product_department order by customer_count desc\",\"chartData\":[{\"product_department\":\"Produce\",\"customer_count\":10386},{\"product_department\":\"Household\",\"customer_count\":8412},{\"product_department\":\"Frozen Foods\",\"customer_count\":8177},{\"product_department\":\"Snack Foods\",\"customer_count\":7314},{\"product_department\":\"Baking Goods\",\"customer_count\":5886},{\"product_department\":\"Canned Foods\",\"customer_count\":5856},{\"product_department\":\"Health and Hygiene\",\"customer_count\":5034},{\"product_department\":\"Dairy\",\"customer_count\":4948},{\"product_department\":\"Beverages\",\"customer_count\":4245},{\"product_department\":\"Deli\",\"customer_count\":3600},{\"product_department\":\"Baked Goods\",\"customer_count\":2358},{\"product_department\":\"Snacks\",\"customer_count\":2078},{\"product_department\":\"Alcoholic Beverages\",\"customer_count\":2051},{\"product_department\":\"Starchy Foods\",\"customer_count\":1609},{\"product_department\":\"Periodicals\",\"customer_count\":1339},{\"product_department\":\"Eggs\",\"customer_count\":1295},{\"product_department\":\"Breakfast Foods\",\"customer_count\":1041},{\"product_department\":\"Canned Products\",\"customer_count\":580},{\"product_department\":\"Seafood\",\"customer_count\":565},{\"product_department\":\"Checkout\",\"customer_count\":564},{\"product_department\":\"Meat\",\"customer_count\":547},{\"product_department\":\"Carousel\",\"customer_count\":270}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"Dummy Report\",\"chart_rows\":[\"customer_count\"],\"chart_cols\":[\"product_department\"],\"query_colums\":[\"product_department\",\"customer_count\"]}";
		Response executeQuery = new DataService().saveReport(reportdate, 1);
		Assert.assertEquals(200, executeQuery.getStatus());
		String resp = executeQuery.getEntity().toString();
		JSONObject obj = new JSONObject(resp);
		String status = obj.get("status").toString();
		Assert.assertEquals("success", status);
	}

	public void testTestConnection() {
		Response testConnection = new DataService().testConnection("mysql",
				"foodmart", "localhost", 3306, "demouser", "demopassword");
		Assert.assertEquals(200, testConnection.getStatus());
		// testConnection = new DataService().testConnection("postgresql",
		// "ng7ex", "33.33.33.200", 5432, "jack", "jack");
		// Assert.assertEquals(200, testConnection.getStatus());
	}

	public void testcreateConnection() {
		Response saveConnection = new DataService().saveConnection("mysql",
				"inkstyxink", "localhost", 3306, "root", "password");
		Assert.assertEquals(200, saveConnection.getStatus());
		// now delete
		Response deleteConnection = new DataService()
				.deleteConnection("mysql-inkstyxink");
		Assert.assertEquals(200, deleteConnection.getStatus());
	}

	public void testDeleteReport() throws JSONException {
		String reportdate = "{\"query\":\"select product_department,sum(customer_count) as customer_count  from agg_g_ms_pcat_sales_fact_1997 group by product_department order by customer_count desc\",\"chartData\":[{\"product_department\":\"Produce\",\"customer_count\":10386},{\"product_department\":\"Household\",\"customer_count\":8412},{\"product_department\":\"Frozen Foods\",\"customer_count\":8177},{\"product_department\":\"Snack Foods\",\"customer_count\":7314},{\"product_department\":\"Baking Goods\",\"customer_count\":5886},{\"product_department\":\"Canned Foods\",\"customer_count\":5856},{\"product_department\":\"Health and Hygiene\",\"customer_count\":5034},{\"product_department\":\"Dairy\",\"customer_count\":4948},{\"product_department\":\"Beverages\",\"customer_count\":4245},{\"product_department\":\"Deli\",\"customer_count\":3600},{\"product_department\":\"Baked Goods\",\"customer_count\":2358},{\"product_department\":\"Snacks\",\"customer_count\":2078},{\"product_department\":\"Alcoholic Beverages\",\"customer_count\":2051},{\"product_department\":\"Starchy Foods\",\"customer_count\":1609},{\"product_department\":\"Periodicals\",\"customer_count\":1339},{\"product_department\":\"Eggs\",\"customer_count\":1295},{\"product_department\":\"Breakfast Foods\",\"customer_count\":1041},{\"product_department\":\"Canned Products\",\"customer_count\":580},{\"product_department\":\"Seafood\",\"customer_count\":565},{\"product_department\":\"Checkout\",\"customer_count\":564},{\"product_department\":\"Meat\",\"customer_count\":547},{\"product_department\":\"Carousel\",\"customer_count\":270}],\"charttitle\":null,\"charttype\":\"column_chart\",\"report_name\":\"Dummy Report\",\"chart_rows\":[\"customer_count\"],\"chart_cols\":[\"product_department\"],\"query_colums\":[\"product_department\",\"customer_count\"]}";
		Response executeQuery = new DataService().saveReport(reportdate, 1);
		Assert.assertEquals(200, executeQuery.getStatus());
		String resp = executeQuery.getEntity().toString();
		JSONObject obj = new JSONObject(resp);
		String id = obj.get("report").toString();

		// delete this report
		new DataService().deleteReport(id);
		Response report = new DataService().getReport(id);
		assertNotNull(report);
		Assert.assertEquals(404, report.getStatus());
	}

	public void testgetConnections() throws JSONException {
		Response saveConnection = new DataService().saveConnection("mysql",
				"inkstyxink", "localhost", 3306, "root", "password");
		Assert.assertEquals(200, saveConnection.getStatus());
		List<CaxpyConnection> connections = H2Db.getConnections();
		assertTrue(connections.size() > 0);
		List<String> dbs = new ArrayList<>();
		for (int i = 0; i < connections.size(); i++) {
			CaxpyConnection caxpyConnection = connections.get(i);
			dbs.add(caxpyConnection.getDbname());
		}
		assertTrue(dbs.contains("inkstyxink"));
		// now delete
		Response deleteConnection = new DataService()
				.deleteConnection("mysql-inkstyxink");
		Assert.assertEquals(200, deleteConnection.getStatus());
	}
	
	public void testgetAllDatabases() throws JSONException {
		Response saveConnection = new DataService().saveConnection("mysql",
				"inkstyxink", "localhost", 3306, "root", "password");
		
		int saveFileInformation = H2Db.saveFileInformation("companies.csv", "");
		assertTrue(saveFileInformation > 0);
		
		Assert.assertEquals(200, saveConnection.getStatus());
		Response connections = new DataService().getAllDatabases();
		String connectionentity = connections.getEntity().toString();
		JSONObject obj = new JSONObject(connectionentity);
		assertTrue(obj.has("sql"));
		assertTrue(obj.has("csv"));
		List<String> dbs = new ArrayList<>();
		JSONArray sqls = obj.getJSONArray("sql");
		JSONArray csv = obj.getJSONArray("csv");
		for (int i = 0; i < sqls.length(); i++) {
			JSONObject o = (JSONObject)sqls.get(i);
			assertTrue(o.has("driver"));
			assertTrue(o.has("host"));
			assertTrue(o.has("port"));
			assertTrue(o.has("username"));
			assertTrue(o.has("password"));
			assertTrue(o.has("connectionname"));
			assertTrue(o.has("db"));
			assertTrue(o.has("dbname"));
			assertTrue(o.has("url"));
			dbs.add(o.get("dbname").toString());
		}
		
		for (int i = 0; i < csv.length(); i++) {
			JSONObject o = (JSONObject)csv.get(i);
			assertTrue(o.has("id"));
			assertTrue(o.has("filename"));
			dbs.add(o.get("filename").toString());
		}
		
		assertTrue(dbs.contains("inkstyxink"));
		assertTrue(dbs.contains("companies.csv"));
		// now delete
		int deletestatus = H2Db.deleteFileInformation(saveFileInformation);
		assertTrue(deletestatus > 0);
		Response deleteConnection = new DataService()
				.deleteConnection("mysql-inkstyxink");
		Assert.assertEquals(200, deleteConnection.getStatus());
	}
	
	public void testgetFileDatabases() throws JSONException {
		int saveFileInformation = H2Db.saveFileInformation("companies.csv", "");
		assertTrue(saveFileInformation > 0);
		
		Response files = new DataService().getFileDatabases();
		String fileent = files.getEntity().toString();
		JSONArray arr = new JSONArray(fileent);
		assertTrue(arr.length() > 0);
		List<String> dbs = new ArrayList<>();
		for (int i = 0; i < arr.length(); i++) {
			JSONObject o = (JSONObject)arr.get(i);
			assertTrue(o.has("id"));
			assertTrue(o.has("filename"));
			dbs.add(o.get("filename").toString());
		}
		assertTrue(dbs.contains("companies.csv"));
		int deletestatus = H2Db.deleteFileInformation(saveFileInformation);
		assertTrue(deletestatus > 0);
	}
	
	public void testgetFileDatabase() throws JSONException {
		int saveFileInformation = H2Db.saveFileInformation("companies.csv", "");
		assertTrue(saveFileInformation > 0);
		
		Response files = new DataService().getFileDatabase(saveFileInformation);
		String fileent = files.getEntity().toString();
		JSONObject o = new JSONObject(fileent);
		assertTrue(o.has("id"));
		assertTrue(o.has("filename"));
		assertTrue(o.get("filename").toString().equals("companies.csv"));
		
		int deletestatus = H2Db.deleteFileInformation(saveFileInformation);
		assertTrue(deletestatus > 0);
	}
}
