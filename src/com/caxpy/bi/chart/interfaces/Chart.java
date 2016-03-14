package com.caxpy.bi.chart.interfaces;

/**
 * Basic Structure of all our charts 
 * 
 * @author Mthukkaram
 *
 */
public interface Chart {

	public String getColumnChart(String reportJson);
	public String getBarChart(String reportJson);
	public String getAreaChart(String reportJson);
	public String getLineChart(String reportJson);
	public String getPieChart(String reportJson);
}
