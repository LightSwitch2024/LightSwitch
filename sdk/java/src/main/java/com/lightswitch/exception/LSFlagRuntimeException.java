package com.lightswitch.exception;

import java.io.IOException;

/**
 * Flag 실행 도중 오류
 */
public class LSFlagRuntimeException extends RuntimeException {

	public LSFlagRuntimeException() {
		super();
	}

	public LSFlagRuntimeException(String message) {
		super(message);
	}

	public LSFlagRuntimeException(String s, IOException e) {
		super(s,e);
	}
}
