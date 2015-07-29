package com.caxpy.bi.servlets;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.caxpy.bi.db.H2Db;
import com.caxpy.bi.utility.ExcelCSVToJSON;
import com.caxpy.bi.utility.FileExtensionWrongException;

/**
 * Servlet implementation class DocumentWarehouse
 */
@WebServlet("/documentwarehouse")
public class DocumentWarehouse extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(DocumentWarehouse.class);
	private DiskFileItemFactory factory = new DiskFileItemFactory();
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DocumentWarehouse() {
		super();
	}

	public static String getStringParameter(Object requestValue) {
		return requestValue != null ? requestValue.toString() : null;
	}

	@Override
	public void init() throws ServletException {
		// Create a factory for disk-based file items
		// Configure a repository (to ensure a secure temp location is used)
		ServletContext servletContext = this.getServletConfig().getServletContext();
		File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
		factory.setRepository(repository);
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int fileid = Integer.parseInt(request.getParameter("id").toString());
		JSONObject fileInformation = H2Db.getFileInformation(fileid);
		response.setStatus(200);
		response.getWriter().write(fileInformation.toString());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		request.setCharacterEncoding("UTF-8");

		// read the path related parameters
		String companyid = getStringParameter(request.getParameter("companyid"));
		String documentlocation = getStringParameter(request.getParameter("documentlocation"));

		String path = getServletContext().getRealPath("/warehouse");// set the
																	// base
																	// directory
		
		String fileurl = "http://localhost:8080/contentserver/warehouse";
		if (companyid != null) {// client location
			path = path + File.separator + companyid;
			fileurl = fileurl + "/"+ companyid;
		}

		if (documentlocation != null) {// document location
			path = path + File.separator + documentlocation;
			fileurl = fileurl + "/"+ documentlocation;
		}

		File file = new File(path);
		if (!file.exists()) {
			file.mkdirs();// make the directories required for storage
		}

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
			//JSONArray array = new JSONArray();
			JSONObject obj = new JSONObject();
			for (FileItem f : list) {
				if (!f.isFormField() && f.getName().length() > 0) {
					String extension = FilenameUtils.getExtension(f.getName());
					if(!extension.equalsIgnoreCase("csv") && !extension.equalsIgnoreCase("xlsx") && !extension.equalsIgnoreCase("xls")){
						throw new FileExtensionWrongException();
					}
					String uploadfilename = f.getName().substring(f.getName().lastIndexOf(File.separator) + 1);
					fileurl = fileurl + "/"+ uploadfilename;
					obj.put("filename", f.getName());
					obj.put("contenttype", f.getContentType());
					obj.put("sizeinbytes", f.getSize());
					obj.put("fileurl", fileurl);
					String location = path + File.separator + uploadfilename;
					InputStream is = f.getInputStream();
					OutputStream os = new FileOutputStream(location);
					IOUtils.copy(is, os);
					is.close();
					os.close();
					//extract data as json from the file
					String datajson = ExcelCSVToJSON.convertToJson(new File(location));
					int saveFileInformation = H2Db.saveFileInformation(f.getName(), datajson);
					obj.put("id", saveFileInformation);
					obj.put("datajson", datajson);
				}
			}
			response.setStatus(200);//file uploaded successfully
			response.getWriter().write(obj.toString());
		} catch (FileUploadException | JSONException | FileExtensionWrongException e) {
			log.error(e);
			response.getWriter().write("Upload Failed");
			response.setStatus(500);
		}
	}

}
