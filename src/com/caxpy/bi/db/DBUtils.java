package com.caxpy.bi.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.apache.commons.dbutils.DbUtils;
import org.apache.log4j.Logger;

import com.caxpy.bi.model.CaxpyConnection;
import com.caxpy.bi.model.ResponseStatus;

/**
 * @author Mthukkaram
 * 
 * http://www.javatips.net/blog/2014/03/apache-dbutils-tutorial
 * 
 */
public class DBUtils {
	private static Logger log = Logger.getLogger(DBUtils.class.getName());

	/**
	 * Return true indicates a successfull connection creation
	 * 
	 * @param c
	 * @return
	 */
	public static ResponseStatus testDatabaseConnection(CaxpyConnection c) {
		ResponseStatus rs = new ResponseStatus();
		final String url = c.getUrl();
		Connection tempconnection = null;
		final String driver = c.getDriver();
		try {
			DbUtils.loadDriver(driver);
			tempconnection = DriverManager.getConnection(url, c.getUsername(),
					c.getPassword());
		} catch (Exception e) {
			log.error(e);
			rs.setMessage(e.getMessage());
			rs.setSuccess(false); 
		} 
		finally {
			try {
				if(tempconnection!=null){
					tempconnection.close();
				}else{
					rs.setSuccess(false); 
				}
			} catch (SQLException e) {
				rs.setMessage(e.getMessage());
				log.error(e);
			}
		}
		return rs;
	}

	public static Connection getDBConnection(String db) throws SQLException {
		CaxpyConnection c = H2Db.getConnectionInformation(db);
		DbUtils.loadDriver(c.getDriver());
		return DriverManager.getConnection(c.getUrl(), c.getUsername(),
				c.getPassword());
	}
}
