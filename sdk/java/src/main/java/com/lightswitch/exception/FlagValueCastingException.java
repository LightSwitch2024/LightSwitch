package com.lightswitch.exception;

import java.io.IOException;

public class FlagValueCastingException extends FlagRuntimeException {
	public FlagValueCastingException() {
	}

	public FlagValueCastingException(String message) {
		super(message);
	}

	public FlagValueCastingException(String s, IOException e) {
		super(s, e);
	}
}
