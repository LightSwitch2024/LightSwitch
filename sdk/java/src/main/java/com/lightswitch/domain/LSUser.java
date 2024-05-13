package com.lightswitch.domain;

import java.util.HashMap;
import java.util.Map;

public class LSUser {
	private final String userId;
	private final Map<String, String> property;

	private LSUser(Builder builder) {
		this.userId = builder.userId;
		this.property = builder.property;
	}

	public String getUserId() {
		return userId;
	}

	public String getProperty(String key) {
		return property.getOrDefault(key, "");
	}

	public boolean hasProperty(){
		return !property.isEmpty();
	}

	public static class Builder {
		private final String userId;
		private final Map<String, String> property;

		public Builder(String userId) {
			this.userId = userId;
			this.property = new HashMap<>();
		}

		public Builder property(String key, String value) {
			property.put(key, value);
			return this;
		}

		public LSUser build() {
			return new LSUser(this);
		}
	}
}

