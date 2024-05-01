package com.lightswitch.domain;

public class Variation {

	private Long id;
	private boolean defaultFlag;
	private String description;
	private int portion;
	private String value;
	private FlagType variationType;

	public int getPortion() {
		return portion;
	}

	public String getValue() {
		return value;
	}
}
