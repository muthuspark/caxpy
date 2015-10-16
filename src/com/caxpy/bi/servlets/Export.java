package com.caxpy.bi.servlets;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

/**
 * Servlet implementation class Export
 */
@WebServlet(name = "export", urlPatterns = { "/export" })
public class Export extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Export() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String svg = request.getParameter("svg");
		OutputStream out = response.getOutputStream();
		String fileid = System.currentTimeMillis() + "";
		String svgfilename = fileid + ".svg";
		File file = new File(svgfilename);
		IOUtils.write(svg.getBytes(StandardCharsets.UTF_8), new FileWriter(file));
		String pdffile = fileid + ".pdf";
		// D:\Delete\CairoSVG-1.0.16\rsvg-convert.exe
		// rsvg-convert -f pdf -o t.pdf t.svg
		Runtime r = Runtime.getRuntime();
		Process p = r.exec("D:\\Delete\\CairoSVG-1.0.16\\rsvg-convert.exe -f pdf -o " + pdffile + " " + file);
		try {
			p.waitFor();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		// set response type
		response.setContentType("application/force-download");
		response.setHeader("Content-disposition", "attachment; filename=" + pdffile);
		FileInputStream in = new FileInputStream(file);
		byte[] buffer = new byte[4096];
		int length;
		while ((length = in.read(buffer)) > 0) {
			out.write(buffer, 0, length);
		}
		in.close();
		out.flush();
	}
}
