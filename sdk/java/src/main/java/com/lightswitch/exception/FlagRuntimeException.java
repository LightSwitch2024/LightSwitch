package com.lightswitch.exception;

/**
 * Flag 실행 도중 오류
 */
public class FlagRuntimeException extends RuntimeException {

	public FlagRuntimeException() {
		super();
	}

	public FlagRuntimeException(String message) {
		super(message);
	}
}
