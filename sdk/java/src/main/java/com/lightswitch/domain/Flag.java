package com.lightswitch.domain;

import java.util.List;

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
