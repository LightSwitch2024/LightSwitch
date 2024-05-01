package com.lightswitch.exception;

import java.io.IOException;

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

	public FlagRuntimeException(String s, IOException e) {
		super(s,e);
	}
}
