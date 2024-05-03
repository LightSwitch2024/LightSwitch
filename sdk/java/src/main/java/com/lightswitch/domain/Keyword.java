package com.lightswitch.domain;

import java.util.List;

public class Keyword {
	private List<Property> properties;
	private String value;

	public Keyword(List<Property> properties, String value) {
		this.properties = properties;
		this.value = value;
	}

	public List<Property> getProperties() {
		return properties;
	}

	public String getValue() {
		return value;
	}
}
