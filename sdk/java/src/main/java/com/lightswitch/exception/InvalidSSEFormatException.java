package com.lightswitch.exception;

import java.io.IOException;

public class InvalidSSEFormatException extends FlagRuntimeException {

	public InvalidSSEFormatException() {
		super();
	}

	public InvalidSSEFormatException(String message) {
		super(message);
	}

	public InvalidSSEFormatException(String s, IOException e) {
		super(s, e);
	}
}
