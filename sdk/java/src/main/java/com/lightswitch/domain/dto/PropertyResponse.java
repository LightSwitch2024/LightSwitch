package com.lightswitch.domain.dto;

import com.lightswitch.domain.Property;

public class PropertyResponse {

	private String property;
	private String data;

	public Property toProperty(){
		return new Property(property, data);
	}
}
