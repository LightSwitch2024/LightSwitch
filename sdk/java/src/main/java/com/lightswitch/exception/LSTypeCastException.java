package com.lightswitch.exception;

import java.io.IOException;
import java.lang.reflect.Type;

public class LSTypeCastException extends LSFlagRuntimeException {
	public LSTypeCastException() {
		super();
	}

	public LSTypeCastException(String message) {
		super(message);
	}

	public LSTypeCastException(String title, Type type) {
		super(title + " 플래그를 " + type + " 타입으로 캐스팅하는데 실패했습니다.");
	}

	public LSTypeCastException(String s, IOException e) {
		super(s, e);
	}
}
