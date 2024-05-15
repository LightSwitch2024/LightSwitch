package com.lightswitch.exception;

import java.io.IOException;

public class LSServerException extends LSFlagRuntimeException {

	public LSServerException() {
		super("LightSwitch 서버와 통신에 실패했습니다.");
	}

	public LSServerException(String message) {
		super(message);
	}

	public LSServerException(String s, IOException e) {
		super(s,e);
	}
}
