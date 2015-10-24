package com.caxpy.bi.db;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.DbUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caxpy.bi.model.CaxpyConnection;
import com.caxpy.bi.model.CaxpyReport;
import com.caxpy.bi.model.Group;
import com.caxpy.bi.model.ResponseStatus;
import com.caxpy.bi.utility.CaxpyConstants;
import com.caxpy.bi.utility.ReportUtility;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

// TODO: Auto-generated Javadoc
/**
 * H2Db.
 *
 * @author Mthukkaram
 */
public class H2Db {

	/** The log. */
	private static Logger log = Logger.getLogger(H2Db.class.getName());

	/** The connection pool. */
	private static HikariDataSource connectionPool = null;
	// public static String DB = "caxpydb";//use for production
	/** The db. */
	public static String DB = "caxpy";

	/**
	 * use a single connection pool.
	 *
	 * @return the connection pool
	 */
	public static synchronized HikariDataSource getConnectionPool() {
		if (connectionPool == null) {
			try {
				//Class.forName("org.h2.Driver");
				//HikariConfig  config = new HikariConfig();
				HikariDataSource ds = new HikariDataSource();
				ds.setDataSourceClassName("org.h2.jdbcx.JdbcDataSource");
				ds.addDataSourceProperty("URL", "jdbc:h2:~/" + DB);
				ds.addDataSourceProperty("user", "sa");
				ds.addDataSourceProperty("password", "sa");
				// config.setMinConnectionsPerPartition(5);
				// config.setMaxConnectionsPerPartition(10);
				// config.setPartitionCount(1);
				connectionPool = ds;
			} catch (Exception e) {
				log.error(e);
			}
		}
		return connectionPool;
	}

	/**
	 * Clob to string.
	 *
	 * @param b
	 *            the b
	 * @return the string
	 */
	private static String clobToString(Clob b) {
		StringBuffer strOut = new StringBuffer();
		String aux = null;
		try {
			BufferedReader br = new BufferedReader(b.getCharacterStream());
			while ((aux = br.readLine()) != null) {
				strOut.append(aux);
				strOut.append(System.getProperty("line.separator"));
			}
		} catch (Exception e) {
			log.error(e);
		}
		return strOut.toString();
	}

	/**
	 * String to clob.
	 *
	 * @param reportJson
	 *            the report json
	 * @return the reader
	 */
	private static Reader stringToClob(String reportJson) {
		InputStream stream = new ByteArrayInputStream(
				reportJson.getBytes(StandardCharsets.UTF_8));
		return new InputStreamReader(stream);
	}

	/**
	 * Gets the report json.
	 *
	 * @param reportid
	 *            the reportid
	 * @param params
	 *            the params
	 * @return the report json
	 */
	public static String getReportJson(long reportid, String params) {
		HikariDataSource connection = getConnectionPool();
		String reportjson = null;
		Connection con = null;
		ResultSet rs = null;
		Statement stmt =  null;
		try {
			con = connection.getConnection();
			stmt = con.createStatement();
			rs = stmt
					.executeQuery("select reportjson, groupid from reports where reportid="
							+ reportid);
			while (rs.next()) {
				reportjson = clobToString(rs.getClob(1));
				JSONObject obj = new JSONObject(reportjson);
				obj.put("group_name", rs.getInt(2));
				reportjson = obj.toString();
			}
		} catch (Exception e) {
			log.error(e);
		} finally {
			DbUtils.closeQuietly(con, stmt, rs);
		}
		if (reportjson != null) {
			try {
				reportjson = ReportUtility.refreshJsonData(reportjson, params);
			} catch (JSONException e) {
				log.error(e);
			}
		}
		return reportjson;
	}
	
	/**
	 * Get all the report from the report location.
	 *
	 * @return table names in the form of array
	 */
	public static JSONArray getReports() {
		JSONArray reports = new JSONArray();
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		ResultSet rs = null;
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat.executeQuery("select reportid,reportname, groupid from reports");
			while (rs.next()) {
				CaxpyReport caxpyReport = new CaxpyReport();
				caxpyReport.setReportid(rs.getLong("reportid"));
				caxpyReport.setGroupid(rs.getInt("groupid"));
				caxpyReport.setReportname(rs.getString("reportname"));
				reports.put(new JSONObject(caxpyReport));
			}
			stat.close();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(rs);
			close(con);
		}
		return reports;
	}

	/**
	 * Make sure this is called only once. This is used to setup our database
	 * for the first time
	 */
	public static void initCaxpyDB() {
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			Statement stat = con.createStatement();
			if (DB.equals("caxpytest")) {
				System.out.println("H2 Test Database created!");
				stat.execute("drop TABLE IF EXISTS reports");
				stat.execute("drop TABLE IF EXISTS connections");
				stat.execute("drop TABLE IF EXISTS mailsettings");
				stat.execute("drop TABLE IF EXISTS files");
				stat.execute("CREATE TABLE IF NOT EXISTS files ( id bigint auto_increment primary key,	filename VARCHAR(500),datajson clob)");
				stat.execute("CREATE TABLE IF NOT EXISTS connections (db VARCHAR(50),	dbname VARCHAR(50),	host VARCHAR(50) NULL,	port INT,	username VARCHAR(50),	password VARCHAR(50))");
				stat.execute("CREATE TABLE IF NOT EXISTS mailsettings (mail VARCHAR(1000))");
				stat.execute("CREATE TABLE IF NOT EXISTS reports (id bigint auto_increment primary key, reportid BIGINT, reportname varchar(500),reportjson clob)");
				stat.execute("CREATE TABLE IF NOT EXISTS groups (id bigint auto_increment primary key,	groupname VARCHAR(1000))");
				stat.execute("ALTER TABLE groups ADD  COLUMN IF NOT EXISTS groupdesc VARCHAR(2000)");
				stat.execute("ALTER TABLE reports ADD  COLUMN IF NOT EXISTS groupid bigint");
				stat.execute("ALTER TABLE reports ADD  COLUMN IF NOT EXISTS ownerid bigint");
				insertSampleData();
			} else {
				System.out.println("H2 Database created!");
				// stat.execute("drop TABLE IF EXISTS reports");
				// stat.execute("drop TABLE IF EXISTS connections");
				stat.execute("CREATE TABLE IF NOT EXISTS connections (db VARCHAR(50),	dbname VARCHAR(50),	host VARCHAR(50) NULL,	port INT,	username VARCHAR(50),	password VARCHAR(50))");
				// stat.execute("drop TABLE mailsettings");
				stat.execute("CREATE TABLE IF NOT EXISTS files ( id bigint auto_increment primary key,	filename VARCHAR(500), datajson clob)");
				stat.execute("CREATE TABLE IF NOT EXISTS mailsettings (mail VARCHAR(1000))");
				stat.execute("CREATE TABLE IF NOT EXISTS reports (id bigint auto_increment primary key, reportid BIGINT, reportname varchar(500),reportjson clob)");
				stat.execute("CREATE TABLE IF NOT EXISTS groups (id bigint auto_increment primary key,	groupname VARCHAR(1000))");
				stat.execute("ALTER TABLE groups ADD  COLUMN IF NOT EXISTS groupdesc VARCHAR(2000)");
				stat.execute("ALTER TABLE reports ADD  COLUMN IF NOT EXISTS groupid bigint");
				stat.execute("ALTER TABLE reports ADD  COLUMN IF NOT EXISTS ownerid bigint");
			}
			con.close();// close the connection after all the work
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
	}

	/**
	 * Gets the mail settings.
	 *
	 * @return the mail settings
	 */
	public static String getMailSettings() {
		HikariDataSource connection = getConnectionPool();
		String mail = "";
		Connection con = null;
		ResultSet rs = null;
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat.executeQuery("select mail from mailsettings");
			while (rs.next()) {
				mail = rs.getString(1);
			}
			stat.closeOnCompletion();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(rs);
			close(con);
		}
		return mail;
	}

	/**
	 * The main method.
	 *
	 * @param args
	 *            the arguments
	 */
	public static void main(String[] args) {
		// initCaxpyDB();
	}

	/**
	 * Insert sample data.
	 */
	private static void insertSampleData() {
		try {
			HikariDataSource connection = getConnectionPool();
			Connection con = connection.getConnection();
			Statement st = con.createStatement();
			st.execute("delete from connections where db='mysql' and dbname='foodmart'");

			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("INSERT INTO connections (db, dbname, host, port, username, password) VALUES (?,?,?,?,?,?)");
			prep.setString(1, "mysql");
			prep.setString(2, "foodmart");
			prep.setString(3, "localhost");
			prep.setInt(4, 3306);
			prep.setString(5, "demouser");
			prep.setString(6, "demopassword");
			prep.execute();
			con.close();// close the connection after all the work
		} catch (SQLException e) {
			log.error(e);
		}

		// insert a few sample reports.
		CaxpyReport rep = new CaxpyReport();
		rep.setReportjson("{\"chartData\":[{\"product_category\":\"Baking Goods\",\"store_sales\":15446.69},{\"product_category\":\"Bathroom Products\",\"store_sales\":13028.87},{\"product_category\":\"Beer and Wine\",\"store_sales\":14029.08},{\"product_category\":\"Bread\",\"store_sales\":16455.43},{\"product_category\":\"Breakfast Foods\",\"store_sales\":15556.93},{\"product_category\":\"Candles\",\"store_sales\":1360.1},{\"product_category\":\"Candy\",\"store_sales\":14550.05},{\"product_category\":\"Canned Anchovies\",\"store_sales\":2296.38},{\"product_category\":\"Canned Clams\",\"store_sales\":1912.68},{\"product_category\":\"Canned Oysters\",\"store_sales\":1442.77},{\"product_category\":\"Canned Sardines\",\"store_sales\":1357.8},{\"product_category\":\"Canned Shrimp\",\"store_sales\":2146.49},{\"product_category\":\"Canned Soup\",\"store_sales\":15966.1},{\"product_category\":\"Canned Tuna\",\"store_sales\":3210.76},{\"product_category\":\"Carbonated Beverages\",\"store_sales\":6236.35},{\"product_category\":\"Cleaning Supplies\",\"store_sales\":7113.02},{\"product_category\":\"Cold Remedies\",\"store_sales\":3356.71},{\"product_category\":\"Dairy\",\"store_sales\":37567.45},{\"product_category\":\"Decongestants\",\"store_sales\":3300.54},{\"product_category\":\"Drinks\",\"store_sales\":5642.29},{\"product_category\":\"Eggs\",\"store_sales\":9200.76},{\"product_category\":\"Electrical\",\"store_sales\":16171.64},{\"product_category\":\"Frozen Desserts\",\"store_sales\":13042.95},{\"product_category\":\"Frozen Entrees\",\"store_sales\":5950.36},{\"product_category\":\"Fruit\",\"store_sales\":29130.65},{\"product_category\":\"Hardware\",\"store_sales\":5412.52},{\"product_category\":\"Hot Beverages\",\"store_sales\":9261.74},{\"product_category\":\"Hygiene\",\"store_sales\":6062.45},{\"product_category\":\"Jams and Jellies\",\"store_sales\":23223.72},{\"product_category\":\"Kitchen Products\",\"store_sales\":9280.2},{\"product_category\":\"Magazines\",\"store_sales\":9056.76},{\"product_category\":\"Meat\",\"store_sales\":30574.78},{\"product_category\":\"Miscellaneous\",\"store_sales\":1982.21},{\"product_category\":\"Packaged Vegetables\",\"store_sales\":1977.86},{\"product_category\":\"Pain Relievers\",\"store_sales\":7970.56},{\"product_category\":\"Paper Products\",\"store_sales\":15442.88},{\"product_category\":\"Pizza\",\"store_sales\":6540.3},{\"product_category\":\"Plastic Products\",\"store_sales\":6327.76},{\"product_category\":\"Pure Juice Beverages\",\"store_sales\":6608.15},{\"product_category\":\"Seafood\",\"store_sales\":3809.14},{\"product_category\":\"Side Dishes\",\"store_sales\":4702.64},{\"product_category\":\"Snack Foods\",\"store_sales\":67609.82},{\"product_category\":\"Specialty\",\"store_sales\":10769.13},{\"product_category\":\"Starchy Foods\",\"store_sales\":11756.07},{\"product_category\":\"Vegetables\",\"store_sales\":71396.59}],\"chart_rows\":[\"store_sales\"],\"query_colums\":[\"product_category\",\"store_sales\"],\"charttitle\":null,\"query\":\"select product_category, sum(store_sales) as store_sales from agg_g_ms_pcat_sales_fact_1997 group by product_category\",\"report_name\":\"1418644690155-Product Category Wise Sales\",\"charttype\":\"pie_chart\",\"chart_cols\":[\"product_category\"]}");
		rep.setReportname("Product Category Wise Sales");
		rep.setReportid(1418644690155l);

		CaxpyReport rep2 = new CaxpyReport();
		rep2.setReportjson("{\"chartData\":[{\"product_department\":\"Alcoholic Beverages\",\"custc\":2051},{\"product_department\":\"Baked Goods\",\"custc\":2358},{\"product_department\":\"Baking Goods\",\"custc\":5886},{\"product_department\":\"Beverages\",\"custc\":4245},{\"product_department\":\"Breakfast Foods\",\"custc\":1041},{\"product_department\":\"Canned Foods\",\"custc\":5856},{\"product_department\":\"Canned Products\",\"custc\":580},{\"product_department\":\"Carousel\",\"custc\":270},{\"product_department\":\"Checkout\",\"custc\":564},{\"product_department\":\"Dairy\",\"custc\":4948},{\"product_department\":\"Deli\",\"custc\":3600},{\"product_department\":\"Eggs\",\"custc\":1295},{\"product_department\":\"Frozen Foods\",\"custc\":8177},{\"product_department\":\"Health and Hygiene\",\"custc\":5034},{\"product_department\":\"Household\",\"custc\":8412},{\"product_department\":\"Meat\",\"custc\":547},{\"product_department\":\"Periodicals\",\"custc\":1339},{\"product_department\":\"Produce\",\"custc\":10386},{\"product_department\":\"Seafood\",\"custc\":565},{\"product_department\":\"Snack Foods\",\"custc\":7314},{\"product_department\":\"Snacks\",\"custc\":2078},{\"product_department\":\"Starchy Foods\",\"custc\":1609}],\"chart_rows\":[\"custc\"],\"query_colums\":[\"product_department\",\"custc\"],\"charttitle\":null,\"query\":\"select product_department, sum(customer_count) as custc from agg_g_ms_pcat_sales_fact_1997 group by product_department\",\"report_name\":\"1418729340556-Sales Report by Product Deparment\",\"charttype\":\"column_chart\",\"chart_cols\":[\"product_department\"]}");
		rep2.setReportname("Sales Report by Product Deparment");
		rep2.setReportid(1418729340556l);

		saveAsReport(rep);
		saveAsReport(rep2);
	}

	/**
	 * Save the entered connection information.
	 *
	 * @param c
	 *            the c
	 * @return true, if successful
	 */
	public static ResponseStatus saveConnection(CaxpyConnection c) {
		ResponseStatus rs = new ResponseStatus();
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("INSERT INTO connections (db, dbname, host, port, username, password) VALUES (?,?,?,?,?,?)");
			prep.setString(1, c.getDb());
			prep.setString(2, c.getDbname());
			prep.setString(3, c.getHost());
			prep.setInt(4, c.getPort());
			prep.setString(5, c.getUsername());
			prep.setString(6, c.getPassword());
			prep.execute();
		} catch (SQLException e) {
			rs.setSuccess(false);
			rs.setMessage(e.getMessage());
			log.error(e);
		} finally {
			close(con);
		}
		return rs;
	}

	/**
	 * Save the entered connection information.
	 *
	 * @param rep
	 *            the rep
	 */
	public static void saveReport(CaxpyReport rep) {
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			PreparedStatement prep = con
					.prepareStatement("update reports set reportjson=? , groupid=?  where reportid=?");
			prep.setClob(1, stringToClob(rep.getReportjson()));
			prep.setInt(2, rep.getGroupid());
			prep.setLong(3, rep.getReportid());
			prep.execute();
		} catch (SQLException e) {
			log.error(e);
		} catch (Exception e) {
			log.error(e);
		} finally {
			close(con);
		}
	}

	/**
	 * Save the entered connection information.
	 *
	 * @param rep
	 *            the rep
	 */
	public static void saveAsReport(CaxpyReport rep) {
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("INSERT INTO reports (reportid,reportname, reportjson, groupid) VALUES (?,?,?,?)");
			prep.setLong(1, rep.getReportid());
			prep.setString(2, rep.getReportname());
			prep.setClob(3, stringToClob(rep.getReportjson()));
			prep.setInt(4, rep.getGroupid());
			prep.execute();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
	}

	/**
	 * Delete report.
	 *
	 * @param reportid
	 *            the reportid
	 */
	public static void deleteReport(long reportid) {
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("delete from reports where reportid=?");
			prep.setLong(1, reportid);
			prep.execute();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
	}

	/**
	 * Delete the connection from database the connectionname is a combination
	 * of db and db name, for example - mysql-foodmart.
	 *
	 * @param connectionname
	 *            the connectionname
	 * @return true, if successful
	 */
	public static boolean deleteConnection(String connectionname) {
		String[] split = connectionname.split("-", 2);

		boolean status = false;
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("delete from connections where db=? and dbname=?");
			prep.setString(1, split[0]);
			prep.setString(2, split[1]);
			prep.execute();
			status = true;
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
		return status;
	}

	/**
	 * Update connection.
	 *
	 * @param oldConnection
	 *            the old connection
	 * @param c
	 *            the c
	 * @return true, if successful
	 */
	public static boolean updateConnection(String oldConnection,
			CaxpyConnection c) {
		String[] split = oldConnection.split("-", 2);
		boolean status = false;
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("UPDATE connections set db=?, dbname=?, host=?, port=?, username=?, password=? where db=? and dbname=?");
			prep.setString(1, c.getDb());
			prep.setString(2, c.getDbname());
			prep.setString(3, c.getHost());
			prep.setInt(4, c.getPort());
			prep.setString(5, c.getUsername());
			prep.setString(6, c.getPassword());
			prep.setString(7, split[0]);
			prep.setString(8, split[1]);
			status = prep.execute();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
		return status;
	}

	/**
	 * Get connection information.
	 *
	 * @param connectionName
	 *            the connection name
	 * @return the connection information
	 */
	public static CaxpyConnection getConnectionInformation(String connectionName) {
		String[] split = connectionName.split("-", 2);
		CaxpyConnection c = new CaxpyConnection();
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		ResultSet rs = null;
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat
					.executeQuery("select db, dbname, host, port, username, password from connections where db='"
							+ split[0] + "' and dbname='" + split[1] + "'");
			while (rs.next()) {
				String db = rs.getString(1);
				String dbname = rs.getString(2);
				String host = rs.getString(3);
				int port = rs.getInt(4);
				String username = rs.getString(5);
				String password = rs.getString(6);

				c.setDb(db);
				c.setDbname(dbname);
				c.setHost(host);
				c.setPassword(password);
				c.setPort(port);
				c.setUsername(username);
			}
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(rs);
			close(con);
		}
		return c;
	}

	/**
	 * Return the list of all available connections from the database.
	 *
	 * @return the connections
	 */
	public static List<CaxpyConnection> getConnections() {
		List<CaxpyConnection> connections = new ArrayList<CaxpyConnection>();
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		ResultSet rs = null;
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat
					.executeQuery("select db, dbname, host, port, username, password from connections");
			while (rs.next()) {
				try {
					String db = rs.getString(1);
					String dbname = rs.getString(2);
					String host = rs.getString(3);
					int port = rs.getInt(4);
					String username = rs.getString(5);
					String password = rs.getString(5);
					CaxpyConnection c = new CaxpyConnection();
					c.setDb(db);
					c.setDbname(dbname);
					c.setHost(host);
					c.setPassword(password);
					c.setPort(port);
					c.setUsername(username);
					c.setConnectionType(CaxpyConstants.SQL.getValue());
					connections.add(c);
				} catch (Exception e) {
					// any exception be ignored
					log.info(e);
					continue;
				}
			}
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(rs);
			close(con);
		}
		return connections;
	}

	/**
	 * Close.
	 *
	 * @param con
	 *            the con
	 */
	public static void close(AutoCloseable con) {
		if (con != null) {
			try {
				con.close();
			} catch (Exception e) {
				log.error(e);
			}
		}
	}

	/**
	 * Close all.
	 */
	public static void closeAll() {
		if (connectionPool != null) {
			System.out.println("H2 Database closed!");
			connectionPool.close();
			connectionPool.shutdown();
			connectionPool = null;
		}
	}

	/**
	 * Save file and return generated id.
	 *
	 * @param filename
	 *            the filename
	 * @param datajson
	 *            the datajson
	 * @return the int
	 */
	public static int saveFileInformation(String filename, String datajson) {
		Connection con = null;
		int auto_id = 0;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con.prepareStatement(
					"INSERT INTO files (filename, datajson) VALUES (?,?)",
					Statement.RETURN_GENERATED_KEYS);
			prep.setString(1, filename);
			prep.setClob(2, stringToClob(datajson));
			prep.execute();
			ResultSet rs = prep.getGeneratedKeys();
			rs.next();
			auto_id = rs.getInt(1);
		} catch (SQLException e) {
			e.printStackTrace();
			log.error(e);
		} finally {
			close(con);
		}
		return auto_id;
	}

	/**
	 * Get file information.
	 *
	 * @param fileid
	 *            the fileid
	 * @return the file information
	 */
	public static JSONObject getFileInformation(int fileid) {
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		ResultSet rs = null;
		JSONObject obj = new JSONObject();
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat
					.executeQuery("select id,filename, datajson from files where id="
							+ fileid);
			while (rs.next()) {
				obj.put("id", rs.getInt(1));
				obj.put("filename", rs.getString(2));
				obj.put("datajson", clobToString(rs.getClob(3)));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		} finally {
			close(rs);
			close(con);
		}
		return obj;
	}

	/**
	 * Get file information.
	 *
	 * @return the all data files
	 */
	public static JSONArray getAllDataFiles() {
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		ResultSet rs = null;
		JSONArray array = new JSONArray();
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat
					.executeQuery("select id,filename from files order by filename asc");
			while (rs.next()) {
				JSONObject obj = new JSONObject();
				obj.put("id", rs.getInt(1));
				obj.put("filename", rs.getString(2));
				array.put(obj);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		} finally {
			close(rs);
			close(con);
		}
		return array;
	}

	/**
	 * Delete file information.
	 *
	 * @param fileid
	 *            the fileid
	 * @return the int
	 */
	public static int deleteFileInformation(int fileid) {
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			stat.execute("delete from files where id=" + fileid);
		} catch (SQLException e) {
			e.printStackTrace();
			log.error(e);
			return 0;
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e);
			return 0;
		} finally {
			close(con);
		}
		return 1;
	}

	/**
	 * Gets the all databases.
	 *
	 * @return the all databases
	 */
	public static JSONObject getAllDatabases() {
		JSONArray files = getAllDataFiles();
		List<CaxpyConnection> sqls = getConnections();
		JSONObject obj = new JSONObject();
		try {
			obj.put(CaxpyConstants.SQL.getValue(), sqls);
			obj.put(CaxpyConstants.CSV.getValue(), files);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
	
	//crud for group
	/**
	 * Insert group.
	 *
	 * @param gp the gp
	 */
	public static Group insertGroup(Group gp){
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("INSERT INTO groups (groupname,groupdesc) VALUES (?,?)");
			prep.setString(1, gp.getName());
			prep.setString(2, gp.getDesc());
			prep.execute();
			ResultSet rs = prep.getGeneratedKeys();
			while (rs.next()) {
				gp.setId(rs.getInt(1));
			}
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
		return gp;
	}
	
	/**
	 * Update group.
	 *
	 * @param gp the gp
	 */
	public static void updateGroup(Group gp){
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			PreparedStatement prep = con
					.prepareStatement("update groups set groupname=?,groupdesc=? where id=?");
			prep.setString(1, gp.getName());
			prep.setString(2, gp.getDesc());
			prep.setInt(3, gp.getId());
			prep.execute();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
	}
	
	/**
	 * Delete group.
	 *
	 * @param gpid the gpid
	 */
	public static void deleteGroup(int gpid){
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			// prepared statement
			Statement stmt = con.createStatement();
			stmt.execute("delete from groups where id="+gpid);
			//update the existing group records inside reports
			stmt.execute("update reports set groupid=0 where groupid="+gpid);
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
	}
	
	/**
	 * Gets the all report groups.
	 *
	 * @return the all report groups
	 */
	public static List<Group> getAllReportGroups(){
		List<Group> groups = new ArrayList<Group>();
		HikariDataSource connection = getConnectionPool();
		Connection con = null;
		ResultSet rs = null;
		try {
			con = connection.getConnection();
			Statement stat = con.createStatement();
			rs = stat
					.executeQuery("select id, groupname, groupdesc from groups");
			while (rs.next()) {
				try {
					int id = rs.getInt(1);
					String name = rs.getString(2);
					String desc = rs.getString(3);
					Group g = new Group();
					g.setId(id);
					g.setName(name);
					g.setDesc(desc);
					groups.add(g);
				} catch (Exception e) {
					// any exception be ignored
					log.info(e);
					continue;
				}
			}
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(rs);
			close(con);
		}
		return groups;
	}

	public static void updateReport(String reportname, int groupid, long reportid) {
		Connection con = null;
		try {
			HikariDataSource connection = getConnectionPool();
			con = connection.getConnection();
			PreparedStatement prep = con
					.prepareStatement("update reports set groupid=?,reportname=? where reportid=?");
			prep.setInt(1, groupid);
			prep.setString(2, reportname);
			prep.setLong(3, reportid);
			prep.execute();
		} catch (SQLException e) {
			log.error(e);
		} finally {
			close(con);
		}
	}
	
}
