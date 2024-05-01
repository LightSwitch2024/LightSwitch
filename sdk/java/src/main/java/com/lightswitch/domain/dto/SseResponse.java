package com.lightswitch.domain.dto;

public class SseResponse {

	private String userKey;
	private SseType type;
	private FlagResponse data;

	public SseType getType() {
		return type;
	}

	public FlagResponse getData() {
		return data;
	}

	@Override
	public String toString() {
		return "SseResponse{" +
			"userKey='" + userKey + '\'' +
			", type=" + type +
			", data=" + data +
			'}';
	}
}
