package com.lightswitch.domain.dto;

import com.google.gson.JsonObject;

public class SseResponse {

	private String userKey;
	private SseType type;
	private FlagResponse data;

	@Override
	public String toString() {
		return "SseResponse{" +
			"userKey='" + userKey + '\'' +
			", type=" + type +
			", data=" + data +
			'}';
	}
}
