package com.caxpy.bi.servlets;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.caxpy.bi.db.H2Db;

/**
 * Servlet implementation class CaxpyInitializer
 */
@WebListener
public class CaxpyInitializer  implements ServletContextListener {
	private static Logger LOG = Logger.getLogger(CaxpyInitializer.class.getName());
	@Override
	public void contextDestroyed(ServletContextEvent event) {
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

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		H2Db.initCaxpyDB();
	}
		
}
