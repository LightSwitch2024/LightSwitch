package com.lightswitch.domain;

public class Variation {

	private int order;
	private String value;
	private int portion;
	private String description;

	public Variation(int order, String value, int portion, String description) {
		this.order = order;
		this.value = value;
		this.portion = portion;
		this.description = description;
	}

	public int getPortion() {
		return portion;
	}

	public String getValue() {
		return value;
	}
}
