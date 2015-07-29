package com.caxpy.bi.utility;

import org.apache.log4j.Logger;

/**
 * This utility class is required in case of reading parameter values.
 * 
 * @author Muthukrishnan
 */
public final class ParameterUtility {

	private static Logger log = Logger.getLogger(ParameterUtility.class
			.getName());

	/**
	 * Default Cunstructer.
	 */
	private ParameterUtility() {

	}

	/**
	 * @param requestValue
	 *            - Pass this value to be checked
	 * @param defaultValue
	 *            - This is what will be returned in case the requestValue is
	 *            null
	 * @return String
	 */
	public static String getStringParameter(Object requestValue,
			String defaultValue) {
		return requestValue != null ? requestValue.toString() : defaultValue;
	}

	/**
	 * @param requestValue
	 *            - Pass this value to be checked. defaultValue - This is what
	 *            will be returned in case the requestValue is "" an empty
	 *            string
	 * @return String
	 */
	public static String getStringParameter(Object requestValue) {
		return requestValue != null ? requestValue.toString() : "";
	}

	public static boolean getBooleanParameter(Object requestValue,
			boolean defaultValue) {
		return requestValue != null ? Boolean.valueOf(requestValue.toString())
				: defaultValue;
	}

	/**
	 * Assumin the return value to be false in case of any failure.
	 * 
	 * @param requestValue
	 * @return boolean
	 */

	public static boolean getBooleanParameter(Object requestValue) {
		return requestValue != null ? Boolean.valueOf(requestValue.toString())
				: false;
	}

	/**
	 * Return default value if the request value is null else parseInt and.
	 * return
	 * 
	 * @param requestValue
	 * @param defaultValue
	 * @return int
	 */
	public static int getIntegerParameter(Object requestValue, int defaultValue) {
		try {
			return requestValue != null? Integer
					.parseInt(requestValue.toString()) : defaultValue;
		} catch (NumberFormatException nfe) {
			log.warn("Faield to Parse Integer Value="+requestValue);
			log.error("Parse Integer :  " , nfe);
		}
		return defaultValue;
	}

	/**
	 * Assumin the return value to be 0 in case of any failure or Default.
	 * 
	 * @param requestValue
	 * @return integer value
	 */
	public static int getIntegerParameter(Object requestValue) {
		try {
			return requestValue != null? Integer
					.parseInt(requestValue.toString().trim()) : 0;
		} catch (NumberFormatException nfe) {
			log.warn("Faield to Parse Integer Value="+requestValue);
			log.error("Parse Integer:  ", nfe);
		}
		return 0;

	}

	/**
	 * Assumin the return value to be 0.0 in case of any failure or Default.
	 * 
	 * @param requestValue
	 * @return Double value
	 */
	public static Double getDoubleParameter(Object requestValue) {
		try {
			return requestValue != null? Double
					.parseDouble(requestValue.toString().trim()) : 0.0;
		} catch (NumberFormatException nfe) {
			log.warn("Faield to Parse Double Value="+requestValue);
			log.error("Parse Double:  " + nfe);
		}
		return 0.0;

	}

	/**
	 * Assuming the return value to be Blank in case of any failure or Default.
	 * 
	 * @param requestValue
	 * @return String
	 */
	public static String checkStringIfNull(Object requestValue) {
		return requestValue != null ? requestValue.toString() : "";
	}

}
