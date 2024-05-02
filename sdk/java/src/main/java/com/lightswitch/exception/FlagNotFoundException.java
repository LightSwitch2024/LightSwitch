package com.lightswitch.exception;

/**
 * Client에서 요청한 Flag를 찾지 못함
 */
public class FlagNotFoundException extends FlagRuntimeException {

	public FlagNotFoundException() {
		super();
	}

	public FlagNotFoundException(String message) {
		super(message);
	}
}
