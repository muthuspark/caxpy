package com.caxpy.bi.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;

import com.caxpy.bi.db.DBUtils;
import com.caxpy.bi.db.H2Db;
import com.caxpy.bi.model.CaxpyConnection;
import com.caxpy.bi.model.Group;
import com.caxpy.bi.model.ResponseStatus;
import com.caxpy.bi.utility.BiUtility;

@Path("/service")
public class DataService {

	private static final String FAILED = "Failed";
	private static final String SUCCESS = "Success";

	@GET
	@Path("/execute")
	@Produces("application/json")
	public Response executeQuery(@QueryParam("query") String query,
			@QueryParam("db") String db) {
		List<Map<String, Object>> response = BiUtility.getResponse(
				query.trim(), db);
		if (response != null) {
			return Response.status(200).entity(response).build();
		}
		return Response.status(500).entity(BiUtility.errormsg).build();
	}

	@GET
	@Path("/reports")
	@Produces("application/json")
	public Response getReports() {
		return Response.status(200).entity(BiUtility.getReports().toString())
				.build();
	}

	@GET
	@Path("/report")
	@Produces("application/json")
	public Response getReport(@QueryParam("reportid") String reportid)
			throws JSONException {
		String report = BiUtility.getReport(reportid);
		if (report == null) {
			return Response.status(404).build();
		}
		// add report id if not available or not added.
		JSONObject obj = new JSONObject(report);
		if (!obj.has("report_id")) {
			obj.put("report_id", reportid);
		}
		return Response.status(200).entity(obj.toString()).build();
	}

	@GET
	@Path("/connections")
	@Produces("application/json")
	public Response getConnections() {
		return Response.status(200).entity(H2Db.getConnections()).build();
	}

	@POST
	@Path("/save")
	@Produces("application/json")
	public Response saveReport(@FormParam("report") String report,
			@FormParam("groupid") int groupid) {
		String report_name = BiUtility.saveReport(report);
		Map<String, String> resData = new HashMap<String, String>();
		resData.put("status", "success");
		resData.put("report", report_name);
		return Response.status(200).entity(resData).build();
	}

	@POST
	@Path("/saveedits")
	@Produces("application/json")
	public Response saveEditedReport(
			@FormParam("reportname") String reportname,
			@FormParam("groupid") int groupid,
			@FormParam("reportid") long reportid) {
		H2Db.updateReport(reportname, groupid, reportid);
		return Response.status(200).entity(SUCCESS).build();
	}

	@POST
	@Path("/saveconnection")
	@Produces("application/json")
	public Response saveConnection(@FormParam("database") String database,
			@FormParam("dbname") String dbname, @FormParam("host") String host,
			@FormParam("port") int port,
			@FormParam("username") String username,
			@FormParam("password") String password) {
		CaxpyConnection c = new CaxpyConnection();
		c.setDb(database);
		c.setDbname(dbname);
		c.setHost(host);
		c.setPassword(password);
		c.setPort(port);
		c.setUsername(username);
		ResponseStatus status = H2Db.saveConnection(c);
		if(status.isSuccess()){
			return Response.status(200).entity(c).build();
		}
		return Response.status(500).entity(status.getMessage()).build();
	}

	@GET
	@Path("/deleteconnection")
	@Produces("application/json")
	public Response deleteConnection(@QueryParam("connection") String connection) {
		boolean success = H2Db.deleteConnection(connection);
		if (success) {
			return Response.status(200).entity(SUCCESS).build();
		}
		return Response.status(403).entity(FAILED).build();
	}

	@PUT
	@Path("/updateconnection")
	@Produces("application/json")
	public Response updateConnection(
			@FormParam("oldconnection") String oldconnection,
			@FormParam("database") String database,
			@FormParam("dbname") String dbname, @FormParam("host") String host,
			@FormParam("port") int port,
			@FormParam("username") String username,
			@FormParam("password") String password) {
		CaxpyConnection c = new CaxpyConnection();
		c.setDb(database);
		c.setDbname(dbname);
		c.setHost(host);
		c.setPassword(password);
		c.setPort(port);
		c.setUsername(username);
		boolean success = H2Db.updateConnection(oldconnection, c);
		if (success) {
			return Response.status(200).entity(SUCCESS).build();
		}
		return Response.status(403).entity(FAILED).build();
	}

	@GET
	@Path("/testconnection")
	@Produces("application/json")
	public Response testConnection(@QueryParam("database") String database,
			@QueryParam("dbname") String dbname,
			@QueryParam("host") String host, @QueryParam("port") int port,
			@QueryParam("username") String username,
			@QueryParam("password") String password) {
		CaxpyConnection c = new CaxpyConnection();
		c.setDb(database);
		c.setDbname(dbname);
		c.setHost(host);
		c.setPassword(password);
		c.setPort(port);
		c.setUsername(username);
		ResponseStatus rs = DBUtils.testDatabaseConnection(c);
		if (rs.isSuccess()) {
			return Response.status(200).entity(rs.getMessage()).build();
		}
		return Response.status(403).entity(rs.getMessage()).build();
	}

	@GET
	@Path("/delete")
	@Produces("application/json")
	public Response deleteReport(@QueryParam("report_name") String report_name) {
		BiUtility.deleteReport(BiUtility.getReportId(report_name));
		return Response.status(200).entity(SUCCESS).build();
	}

	@GET
	@Path("/filedatabases")
	@Produces("application/json")
	public Response getFileDatabases() {
		return Response.status(200).entity(H2Db.getAllDataFiles().toString())
				.build();
	}

	@GET
	@Path("/alldatabases")
	@Produces("application/json")
	public Response getAllDatabases() {
		return Response.status(200).entity(H2Db.getAllDatabases().toString())
				.build();
	}

	@GET
	@Path("/filedatabase")
	@Produces("application/json")
	public Response getFileDatabase(@QueryParam("fileid") int fileid) {
		return Response.status(200)
				.entity(H2Db.getFileInformation(fileid).toString()).build();
	}

	@GET
	@Path("/deletefiledatabase")
	@Produces("application/json")
	public Response deleteFileDatabases(@QueryParam("fileid") int fileid) {
		int deletestatus = H2Db.deleteFileInformation(fileid);
		Response response = Response.status(200).entity(SUCCESS).build();
		if (deletestatus == 0) {
			response = Response.status(500).entity(FAILED).build();
		}
		return response;
	}

	// For groups
	@GET
	@Path("/groups")
	@Produces("application/json")
	public Response getGroups() {
		return Response.status(200).entity(H2Db.getAllReportGroups()).build();
	}

	@POST
	@Path("/group")
	@Consumes("application/json")
	@Produces("application/json")
	public Response saveGroup(Group group) {
		return Response.status(200).entity(H2Db.insertGroup(group)).build();
	}

	@PUT
	@Path("/group")
	@Consumes("application/json")
	@Produces("application/json")
	public Response updateGroup(Group group) {
		H2Db.updateGroup(group);
		return Response.status(200).entity(group).build();
	}

	@DELETE
	@Path("/group")
	@Produces("application/json")
	public Response deleteGroup(@QueryParam("id") int id) {
		H2Db.deleteGroup(id);
		return Response.status(200).entity(SUCCESS).build();
	}

	// @POST
	// @Path("/savesettings")
	// @Produces("application/json")
	// public Response saveSettings(@FormParam("settings") String settings) {
	// H2Db.saveSettings(settings);
	// return Response.status(200).entity("Done").build();
	// }
	//
	// @GET
	// @Path("/mailsettings")
	// @Produces("application/json")
	// public Response getMailSettings() {
	// return Response.status(200).entity(H2Db.getMailSettings()).build();
	// }
}
