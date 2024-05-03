package com.lightswitch.domain;

public class Property {

	private String property;
	private String data;

	public Property(String property, String data) {
		this.property = property;
		this.data = data;
	}

	public String getProperty() {
		return property;
	}

	public String getData() {
		return data;
	}
}
