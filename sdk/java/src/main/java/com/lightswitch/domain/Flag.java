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

	public String getTitle() {
		return title;
	}

	public List<Variation> getVariations() {
		return variations;
	}

	public Object getValue(Context context) {
		double percentage = HashUtil.getHashedPercentage(String.valueOf(context.getUserId()), 1);

		for (Variation variation : variations) {
			int portion = variation.getPortion();

			percentage -= portion;
			if(percentage < 0){
				return variation.getValue();
			}
		}
		return null;
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
