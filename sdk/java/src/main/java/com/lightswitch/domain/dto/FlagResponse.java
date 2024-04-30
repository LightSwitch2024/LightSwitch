package com.lightswitch.domain.dto;

import java.util.ArrayList;
import java.util.List;

import com.lightswitch.domain.Flag;
import com.lightswitch.domain.FlagType;
import com.lightswitch.domain.Variation;

public class FlagResponse {

	private long flagId;
	private String title;
	private String description;
	private FlagType type;
	private String defaultValue;
	private int defaultValuePortion;
	private String defaultValueDescription;
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
		List<Variation> variList = new ArrayList<>();
		variations.forEach(variationResponse -> variList.add(variationResponse.toVariation()));

		return new Flag.Builder()
			.flagId(flagId)
			.type(type)
			.active(active)
			.title(title)
			.description(description)
			.variations(variList)
			.defaultValue(defaultValue)
			.build();
	}

	@Override
	public String toString() {
		return "FlagResponse{" +
			"flagId=" + flagId +
			", title='" + title + '\'' +
			", description='" + description + '\'' +
			", type=" + type +
			", defaultValue='" + defaultValue + '\'' +
			", defaultValuePortion=" + defaultValuePortion +
			", defaultValueDescription='" + defaultValueDescription + '\'' +
			", variations=" + variations +
			", maintainerId=" + maintainerId +
			", createdAt='" + createdAt + '\'' +
			", updatedAt='" + updatedAt + '\'' +
			", deletedAt='" + deletedAt + '\'' +
			", active=" + active +
			'}';
	}
}
