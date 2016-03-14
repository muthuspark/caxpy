package com.caxpy.bi.model;

import org.apache.commons.lang.StringEscapeUtils;

// TODO: Auto-generated Javadoc
/**
 * The Class CaxpyReport.
 */
public class CaxpyReport {

	/**
	 * Gets the reportid.
	 *
	 * @return the reportid
	 */
	public long getReportid() {
		return reportid;
	}

	/**
	 * Sets the reportid.
	 *
	 * @param reportid
	 *            the new reportid
	 */
	public void setReportid(long reportid) {
		this.reportid = reportid;
	}

	/**
	 * Gets the reportjson.
	 *
	 * @return the reportjson
	 */
	public String getReportjson() {
		return reportjson;
	}

	/**
	 * Sets the reportjson.
	 *
	 * @param reportjson
	 *            the new reportjson
	 */
	public void setReportjson(String reportjson) {
		this.reportjson = reportjson;
	}

	/**
	 * Gets the reportname.
	 *
	 * @return the reportname
	 */
	public String getReportname() {
		return reportname;
	}

	/**
	 * Sets the reportname.
	 *
	 * @param reportname
	 *            the new reportname
	 */
	public void setReportname(String reportname) {
		String tempname = reportname.contains("-") ? reportname.split("-")[1]
				: reportname;
		this.reportname = StringEscapeUtils.escapeHtml(tempname);
	}

	/** The reportid. */
	private long reportid;

	/** The reportjson. */
	private String reportjson;

	/** The reportname. */
	private String reportname;

	private int groupid = 0;

	public int getGroupid() {
		return groupid;
	}

	public void setGroupid(int groupid) {
		this.groupid = groupid;
	}

}
