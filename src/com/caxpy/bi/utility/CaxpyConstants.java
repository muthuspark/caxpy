package com.caxpy.bi.utility;

public enum CaxpyConstants {

	CSV("csv"), SQL("sql");
	private String value;

	private CaxpyConstants(String value) {
		this.value = value;
	}
	
	public String getValue(){
		return value;
	}
}
