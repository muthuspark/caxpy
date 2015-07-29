package com.caxpy.bi.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caxpy.bi.utility.BiUtility;
import com.caxpy.bi.utility.ReportUtility;

/**
 * Servlet implementation class report
 */
@WebServlet("/report")
public class Report extends HttpServlet {
	private static final long serialVersionUID = -1614131647377560349L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.addHeader("Access-Control-Allow-Origin", "*");
		String params = request.getParameter("params")!=null? request.getParameter("params").toString() : null;
		String reportid = request.getParameter("reportid").toString();
		response.setContentType("application/json");
		response.getWriter().write(ReportUtility.getReportJson(BiUtility.getReportId(reportid),params));
	}
}
