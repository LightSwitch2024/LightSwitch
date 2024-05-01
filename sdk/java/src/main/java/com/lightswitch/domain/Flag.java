package com.lightswitch.domain;

import java.util.List;

import com.lightswitch.util.HashUtil;

public class Flag {

	private Long flagId;
	private boolean active; // On Off
	private String title;
	private String description;
	private List<Variation> variations;
	private FlagType type;
	private String defaultValue;

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

	protected Flag(Builder builder) {
		this.flagId = builder.flagId;
		this.active = builder.active;
		this.title = builder.title;
		this.description = builder.description;
		this.variations = builder.variations;
		this.type = builder.type;
		this.defaultValue = builder.defaultValue;
	}

	public static class Builder {
		private Long flagId;
		private boolean active; // On Off
		private String title;
		private FlagType type;
		private String description;
		private List<Variation> variations;
		private String defaultValue;

		public Builder() {
		}

		public Builder flagId(Long flagId){
			this.flagId = flagId;
			return this;
		}

		public Builder active(boolean active){
			this.active = active;
			return this;
		}


		public Builder title(String title){
			this.title = title;
			return this;
		}

		public Builder description(String description){
			this.description = description;
			return this;
		}

		public Builder variations(List<Variation> variations){
			this.variations = variations;
			return this;
		}

		public Builder type(FlagType type){
			this.type = type;
			return this;
		}

		public Builder defaultValue(String defaultValue){
			this.defaultValue = defaultValue;
			return this;
		}


		public Flag build() {
			return new Flag(this);
		}
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
