package com.lightswitch.exception;

/**
 * Client 요청에서 발생하는 오류
 */
public class LSFlagClientException extends Exception {

	public LSFlagClientException() {
		super();
	}

	public LSFlagClientException(String message) {
		super(message);
	}
}
