package com.lightswitch.domain.dto;

import java.util.ArrayList;
import java.util.List;

import com.lightswitch.domain.Flag;
import com.lightswitch.domain.FlagType;
import com.lightswitch.domain.Keywords;
import com.lightswitch.domain.Variation;

public class FlagResponse {

	private long flagId;
	private String title;
	private String description;
	private FlagType type;
	private List<Keywords> keywords;
	private String defaultValueForKeyword;
	private int defaultPortionForKeyword;
	private String defaultDescriptionForKeyword;
	private List<VariationResponse> variationsForKeyword;
	private String defaultValue;
	private int defaultPortion;
	private String defaultDescription;
	private List<VariationResponse> variations;
	private int maintainerId;
	private String createdAt;
	private String updatedAt;
	private String deletedAt;
	private boolean active;

	public String getTitle() {
		return title;
	}

	public Flag toFlag() {
		List<Variation> variationsForKeyword = new ArrayList<>();
		this.variationsForKeyword.forEach(variationResponse -> variationsForKeyword.add(variationResponse.toVariation()));
		List<Variation> variations = new ArrayList<>();
		this.variations.forEach(variationResponse -> variations.add(variationResponse.toVariation()));

		return new Flag(flagId, title, description, type, keywords,
			defaultValueForKeyword, defaultPortionForKeyword, defaultDescriptionForKeyword,
			variations, defaultValue, defaultPortion, defaultDescription,
			variationsForKeyword, maintainerId, createdAt, updatedAt, deletedAt, active);
	}
}
