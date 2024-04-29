package com.lightswitch.exception;

/**
 * Client가 요청한 Variation이 잘못된 값일 경우
 */

public class FlagVariationNotFoundException extends FlagClientException {

	public FlagVariationNotFoundException() {
		super();
	}

	public FlagVariationNotFoundException(String message) {
		super(message);
	}
}
