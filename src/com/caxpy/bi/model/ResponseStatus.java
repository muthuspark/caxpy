package com.caxpy.bi.model;

public class ResponseStatus {

	private String message = "Success";
	private boolean success = true;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

}
