package com.lightswitch.exception;

/**
 * Client 요청에서 발생하는 오류
 */
public class FlagClientException extends Exception {

	public FlagClientException() {
		super();
	}

	public FlagClientException(String message) {
		super(message);
	}
}
