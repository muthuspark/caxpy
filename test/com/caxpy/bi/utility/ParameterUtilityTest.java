package com.caxpy.bi.utility;

import junit.framework.TestCase;




public class ParameterUtilityTest extends TestCase {

	public void testgetStringParameter_INFO() {
		String actual = ParameterUtility.getStringParameter("a");
		String expected = "a";
		assertEquals(expected, actual);
	}

	public void testgetStringParameter_NULL() {
		String actual = ParameterUtility.getStringParameter(null);
		String expected = "";
		assertEquals(expected, actual);
	}

	public void testgetStringParameter_default() {
		String actual = ParameterUtility.getStringParameter(null, "default");
		String expected = "default";
		assertEquals(expected, actual);
	}

	public void testgetBooleanParameter_PassDefaultValue() {
		boolean actual = ParameterUtility.getBooleanParameter("asd", false);
		boolean expected = false;
		assertEquals(expected, actual);
	}

	public void testgetBooleanParameter_PassBooleanValue() {
		boolean actual = ParameterUtility.getBooleanParameter("false", false);
		boolean expected = false;
		assertEquals(expected, actual);
	}

	public void testgetBooleanParameter() {
		boolean actual = ParameterUtility.getBooleanParameter("abc");
		boolean expected = false;
		assertEquals(expected, actual);
	}

	public void testgetIntegerParameter() {
		int actual = ParameterUtility.getIntegerParameter("abc", 1);
		int expected = 1;
		assertEquals(expected, actual);
	}

	public void testgetIntegerParameter_2() {
		int actual = ParameterUtility.getIntegerParameter("2", 1);
		int expected = 2;
		assertEquals(expected, actual);
	}

	public void testgetIntegerParameter_1() {
		int actual = ParameterUtility.getIntegerParameter("0");
		int expected = 0;
		assertEquals(expected, actual);
	}


	public void testgetIntegerParameter_3() {
		int actual = ParameterUtility.getIntegerParameter("");
		int expected = 0;
		assertEquals(expected, actual);
	}

	public void testgetIntegerParameter_exception() {
		int actual = ParameterUtility.getIntegerParameter("test");
		int expected = 0;
		assertEquals(expected, actual);
	}

	public void testgetDoubleParameter() {
		double actual = ParameterUtility.getDoubleParameter(1);
		double expect = 1.0;
		assertEquals(expect, actual);
	}
	
	public void testgetDoubleParameter_2() {
		double actual = ParameterUtility.getDoubleParameter("2.0");
		double expect = 2.0;
		assertEquals(expect, actual);
	}

	public void testgetDoubleParameter_exception() {
		double actual = ParameterUtility.getDoubleParameter("test");
		double expect = 0.0;
		assertEquals(expect, actual);
	}

	public void testcheckStringIfNull_PassValue_Returnsamevalue() {
		String actual = ParameterUtility.checkStringIfNull("2[1]");
		String expected = "2[1]";
		assertEquals(expected, actual);
	}

	public void testcheckStringIfNull_PassNullValue_ReturnNull() {
		String actual = ParameterUtility.checkStringIfNull("");
		String expected = "";
		assertEquals(expected, actual);
	}

}
