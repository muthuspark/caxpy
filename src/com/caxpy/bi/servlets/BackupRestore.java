package com.caxpy.bi.servlets;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.caxpy.bi.db.H2Db;

/**
 * Servlet implementation class BackupRestore
 */
@WebServlet(name = "backuprestore", urlPatterns = { "/backuprestore" })
public class BackupRestore extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 5477937236499689139L;
	private static Logger LOG = Logger.getLogger(BackupRestore.class.getName());
	private DiskFileItemFactory factory = new DiskFileItemFactory();
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BackupRestore() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	   closeAllDatabases();
       
		response.setContentType("application/force-download");
		 // Make sure to show the download dialog
        response.setHeader("Content-disposition","attachment; filename=caxpy.db");

        File my_file = new File(System.getProperty("user.home")+File.separatorChar+H2Db.DB+".mv.db");

        // This should send the file to browser
        OutputStream out = response.getOutputStream();
        FileInputStream in = new FileInputStream(my_file);
        byte[] buffer = new byte[4096];
        int length;
        while ((length = in.read(buffer)) > 0){
           out.write(buffer, 0, length);
        }
        in.close();
        out.flush();
        
        openAllDatabases();
	}

	private void openAllDatabases() {
		H2Db.initCaxpyDB();
	}

	private void closeAllDatabases() {
		H2Db.closeAll();
			 // This manually deregisters JDBC driver, which prevents Tomcat 7 from complaining about memory leaks wrto this class
		   Enumeration<Driver> drivers = DriverManager.getDrivers();
		   while (drivers.hasMoreElements()) {
		       Driver driver = drivers.nextElement();
		       try {
		           DriverManager.deregisterDriver(driver);
		           LOG.log(Level.INFO, String.format("deregistering jdbc driver: %s", driver));
		       } catch (SQLException e) {
		           LOG.log(Level.FATAL, String.format("Error deregistering driver %s", driver), e);
		       }

		   }
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		closeAllDatabases();
		
		if (!ServletFileUpload.isMultipartContent(request)) {
			response.getWriter().write("must be multipart/form-data");
			response.setHeader("refresh", "1;url=" + request.getContextPath());
			return;
		}

		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload(factory );
		upload.setFileSizeMax(100 * 1024 * 1024);
		
		UploadProgressListener uploadProgressListener = new UploadProgressListener();
		upload.setProgressListener(uploadProgressListener);
		request.getSession().setAttribute("uploadProgressListener", uploadProgressListener);

		try {
			// Parse the request
			List<FileItem> list = upload.parseRequest(request);
			for (FileItem f : list) {
				if (!f.isFormField() && f.getName().length() > 0) {
					String location = System.getProperty("user.home")+File.separatorChar+H2Db.DB+".mv.db";
					InputStream is = f.getInputStream();
					OutputStream os = new FileOutputStream(location);
					IOUtils.copy(is, os);
					is.close();
					os.close();
				}
			}
			response.setStatus(200);//file uploaded successfully
		} catch (FileUploadException e) {
			LOG.error(e);
			response.getWriter().write("Upload Failed"); 
			response.setStatus(500);
		}
		
		openAllDatabases();
	}
	
	@Override
	public void init() throws ServletException {
		// Create a factory for disk-based file items
		// Configure a repository (to ensure a secure temp location is used)
		ServletContext servletContext = this.getServletConfig().getServletContext();
		File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
		factory.setRepository(repository);
	}
}
