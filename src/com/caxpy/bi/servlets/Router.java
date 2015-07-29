package com.caxpy.bi.servlets;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet Filter implementation class AuthenticationFilter
 */
@WebFilter("/Router")
public class Router implements Filter {

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession();
		String requestURL = req.getRequestURL().toString();
		if (requestURL.endsWith("login.html")
				|| requestURL.contains("/report")
				|| requestURL.contains("/dashboard")
				|| requestURL.endsWith("app")
				|| requestURL.contains("/images/")
				|| requestURL.contains("/css/")
				|| requestURL.contains("/js/")
				|| requestURL.endsWith("embed.js")
				|| requestURL.contains("/images/")
				|| (session != null && session.getAttribute("logged") != null && session
						.getAttribute("logged").equals("true"))) {
			
			if(requestURL.endsWith("/groups") && !requestURL.contains("data/service")){
				req.getRequestDispatcher("admin/groups.html").forward(request, response);
			}
			else if(requestURL.endsWith("/backup") && !requestURL.contains("data/service")){
				req.getRequestDispatcher("admin/backup.html").forward(request, response);
			}
			else if(requestURL.endsWith("/settings") && !requestURL.contains("data/service")){
				req.getRequestDispatcher("admin/settings.html").forward(request, response);
			}else if((requestURL.endsWith("/admin") || requestURL.endsWith("/admin/")) && !requestURL.contains("data/service")){
				req.getRequestDispatcher("admin/groups.html").forward(request, response);
			}
			else{
				chain.doFilter(request, response);
			}
		} else {
			res.sendRedirect(req.getContextPath() + "/login.html");
		}
	}

	@Override
	public void destroy() {
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {

	}
}
