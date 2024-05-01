package com.lightswitch.domain;

import java.util.List;

import com.lightswitch.domain.dto.VariationResponse;
import com.lightswitch.util.HashUtil;

public class Flag {

	private long flagId;
	private String title;
	private String description;
	private FlagType type;
	private List<Keywords> keywords;
	private String defaultValueForKeyword;
	private int defaultPortionForKeyword;
	private String defaultDescriptionForKeyword;
	private List<Variation> variationsForKeyword;
	private String defaultValue;
	private int defaultPortion;
	private String defaultDescription;
	private List<Variation> variations;
	private int maintainerId;
	private String createdAt;
	private String updatedAt;
	private String deletedAt;
	private boolean active;

	public String getTitle() {
		return title;
	}

	public List<Variation> getVariations() {
		return variations;
	}

	public FlagType getType() {
		return type;
	}

	public Object getValue(Context context) {
		double percentage = HashUtil.getHashedPercentage(String.valueOf(context.getUserId()), 1);
		String value = defaultValue;
		for (Variation variation : variations) {
			int portion = variation.getPortion();

			percentage -= portion;
			if(percentage < 0){
				value = variation.getValue();
				break;
			}
		}

		if (type.equals(FlagType.BOOLEAN)) {
			return Boolean.valueOf(value);
		} else if (type.equals(FlagType.NUMBER)) {
			return Integer.valueOf(value);
		}
		return value;
	}

	public Flag(long flagId, String title, String description, FlagType type, List<Keywords> keywords,
		String defaultValueForKeyword, int defaultPortionForKeyword, String defaultDescriptionForKeyword,
		List<Variation> variationsForKeyword, String defaultValue, int defaultPortion, String defaultDescription,
		List<Variation> variations, int maintainerId, String createdAt, String updatedAt, String deletedAt,
		boolean active) {
		this.flagId = flagId;
		this.title = title;
		this.description = description;
		this.type = type;
		this.keywords = keywords;
		this.defaultValueForKeyword = defaultValueForKeyword;
		this.defaultPortionForKeyword = defaultPortionForKeyword;
		this.defaultDescriptionForKeyword = defaultDescriptionForKeyword;
		this.variationsForKeyword = variationsForKeyword;
		this.defaultValue = defaultValue;
		this.defaultPortion = defaultPortion;
		this.defaultDescription = defaultDescription;
		this.variations = variations;
		this.maintainerId = maintainerId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.deletedAt = deletedAt;
		this.active = active;
	}

	@Override
	public String toString() {
		return "Flag{" +
			"flagId=" + flagId +
			", active=" + active +
			", title='" + title + '\'' +
			", description='" + description + '\'' +
			", variations=" + variations +
			", type=" + type +
			'}';
	}
}
