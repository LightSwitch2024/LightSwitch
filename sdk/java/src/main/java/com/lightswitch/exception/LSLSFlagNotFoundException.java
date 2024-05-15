package com.lightswitch.exception;

/**
 * Client에서 요청한 Flag를 찾지 못함
 */
public class LSLSFlagNotFoundException extends LSFlagRuntimeException {

	public LSLSFlagNotFoundException() {
		super();
	}

	public LSLSFlagNotFoundException(String title) {
		super(title + " 플래그가 존재하지 않습니다.");
	}
}
