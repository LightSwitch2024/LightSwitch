package com.lightswitch.domain;

import java.util.ArrayList;
import java.util.List;

import com.lightswitch.exception.FlagValueCastingException;
import com.lightswitch.util.HashUtil;

public class Flag {

	private long flagId;
	private String title;
	private String description;
	private FlagType type;
	private List<Keyword> keywords;
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

	public boolean isActive() {
		return active;
	}

	public void switchFlag(boolean active) {
		this.active = active;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public <T> T getValue(LSUser LSUser) throws FlagValueCastingException {
		String value = isActive() ? calValue(LSUser) : defaultValue;
		return getValueWithType(value);
	}

	private String calValue(LSUser LSUser) {
		if(!keywords.isEmpty() && LSUser.hasProperty()){
			for (Keyword keyword : keywords) {
				if (keyword.getProperties().stream()
					.allMatch(property -> LSUser.getProperty(property.getProperty()).equals(property.getData()))) {
					return keyword.getValue();
				}
			}
		}
		return calValue(LSUser.getUserId());
	}

	private <T> T getValueWithType(String value) throws FlagValueCastingException {
		if (type.equals(FlagType.BOOLEAN)) {
			return (T)Boolean.valueOf(value);
		} else if (type.equals(FlagType.STRING)) {
			return (T)String.valueOf(value);
		} else if (type.equals(FlagType.INTEGER)) {
			return (T)Integer.valueOf(value);
		}
		return null;
	}

	private String calValue(int userId) {
		double percentage = HashUtil.getHashedPercentage(String.valueOf(userId), 1);

		for (Variation variation : variations) {
			percentage -= variation.getPortion();
			if (percentage <= 0) {
				return variation.getValue();
			}
		}
		return defaultValue;
	}

	public Flag(long flagId, String title, String description, FlagType type, List<Keyword> keywords,
		String defaultValue, int defaultPortion, String defaultDescription, List<Variation> variations,
		int maintainerId,
		String createdAt, String updatedAt, String deletedAt, boolean active) {
		this.flagId = flagId;
		this.title = title;
		this.description = description;
		this.type = type;
		this.keywords = keywords;
		if (keywords == null) {
			this.keywords = new ArrayList<>();
		}
		this.defaultValue = defaultValue;
		this.defaultPortion = defaultPortion;
		this.defaultDescription = defaultDescription;
		this.variations = variations;
		if (variations == null) {
			this.variations = new ArrayList<>();
		}
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
