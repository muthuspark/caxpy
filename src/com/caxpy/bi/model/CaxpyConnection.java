package com.caxpy.bi.model;

/**
 * Connection Entity
 * 
 * @author Mthukkaram
 * 
 */
public class CaxpyConnection {

	private String db;
	private String connectionname;
	private String host;
	private String dbname;
	private int port;
	private String username;
	private String password;
	private String connectionType;
	
	public String getConnectionType() {
		return connectionType;
	}
	
	public void setConnectionType(String connectionType) {
		this.connectionType = connectionType;
	}

	public String getDb() {
		return db;
	}

	public void setDb(String db) {
		this.db = db;
	}

	public String getConnectionname() {
		connectionname = db + "-" + dbname;
		return connectionname;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getDbname() {
		return dbname;
	}

	public void setDbname(String dbname) {
		this.dbname = dbname;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		if(password==null){
			password = "";
		}
		this.password = password;
	}

	/**
	 * Get connection url for the current database object
	 * 
	 * @return
	 */
	public String getUrl(){
		if(db.toLowerCase().equals("mysql")){
			return "jdbc:mysql://"+host+":"+port+"/"+dbname;
		}else if(db.toLowerCase().equals("postgresql")){
			return "jdbc:postgresql://"+host+":"+port+"/"+dbname;
		}
		return "";
	}
	
	public String getDriver(){
		if(db.toLowerCase().equals("mysql")){
			return "com.mysql.jdbc.Driver";
		}else if(db.toLowerCase().equals("postgresql")){
			return "org.postgresql.Driver";
		}
		return "";
	}
}
