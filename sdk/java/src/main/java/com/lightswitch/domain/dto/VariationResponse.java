package com.lightswitch.domain.dto;

import com.lightswitch.domain.Variation;

public class VariationResponse {

	private int order;
	private String value;
	private int portion;
	private String description;

	public Variation toVariation(){
		return new Variation(order, value, portion, description);
	}
}
