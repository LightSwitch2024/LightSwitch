package com.lightswitch.exception;

import java.io.IOException;

public class FlagServerConnectException extends FlagRuntimeException {

	public FlagServerConnectException() {
		super();
	}

	public FlagServerConnectException(String message) {
		super(message);
	}

	public FlagServerConnectException(String s, IOException e) {
		super(s,e);
	}
}
