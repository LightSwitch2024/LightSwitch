package com.lightswitch.domain.dto;

import java.util.ArrayList;
import java.util.List;

import com.lightswitch.domain.Keyword;
import com.lightswitch.domain.Property;

public class KeywordResponse {

	private List<PropertyResponse> properties;
	private String value;

	public Keyword toKeyword(){
		List<Property> properties = new ArrayList<>();
		this.properties.forEach(propertyResponse -> properties.add(propertyResponse.toProperty()));
		return new Keyword(properties, value);
	}
}
