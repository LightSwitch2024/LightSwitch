package com.lightswitch.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Context {
	private final int userId;
	private final Map<String, String> property;

	private Context(Builder builder) {
		this.userId = builder.userId;
		this.property = builder.property;
	}

	public int getUserId() {
		return userId;
	}

	public List<String> getProperty() {
		return new ArrayList<>(property.values());
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

		public Context build() {
			return new Context(this);
		}
	}
}

