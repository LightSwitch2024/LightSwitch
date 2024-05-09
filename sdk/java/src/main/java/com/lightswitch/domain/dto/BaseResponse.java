package com.lightswitch.domain.dto;

public class BaseResponse<T> {

	private int code;
	private String message;
	private T data;

	public BaseResponse(int code, String message, T data) {
		this.code = code;
		this.message = message;
		this.data = data;
	}

	public int getCode() {
		return code;
	}

	public T getData() {
		return data;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public void setData(T data) {
		this.data = data;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
