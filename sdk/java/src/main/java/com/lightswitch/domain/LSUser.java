package com.lightswitch.domain;

import java.util.HashMap;
import java.util.Map;

public class LSUser {
	private final int userId;
	private final Map<String, String> property;

	private LSUser(Builder builder) {
		this.userId = builder.userId;
		this.property = builder.property;
	}

	public int getUserId() {
		return userId;
	}

	public String getProperty(String key) {
		return property.get(key);
	}

	public static class Builder {
		private final int userId;
		private final Map<String, String> property;

		public Builder(int userId) {
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

