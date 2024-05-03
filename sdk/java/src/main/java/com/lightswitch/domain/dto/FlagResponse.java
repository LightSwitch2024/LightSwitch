package com.lightswitch.domain.dto;

import java.util.ArrayList;
import java.util.List;

import com.lightswitch.domain.Keyword;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.FlagType;
import com.lightswitch.domain.Variation;

public class FlagResponse {

	private long flagId;
	private String title;
	private String description;
	private FlagType type;
	private List<KeywordResponse> keywords;
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

	public boolean isActive() {
		return active;
	}

	public Flag toFlag() {
		List<Keyword> keywords = new ArrayList<>();
		this.keywords.forEach(keywordResponse -> keywords.add(keywordResponse.toKeyword()));
		List<Variation> variations = new ArrayList<>();
		this.variations.forEach(variationResponse -> variations.add(variationResponse.toVariation()));

		return new Flag(flagId, title, description, type, keywords, defaultValue, defaultPortion, defaultDescription,
			variations, maintainerId, createdAt, updatedAt, deletedAt, active);
	}
}
