package com.lightswitch.impl;

import com.lightswitch.domain.LSUser;

public interface LightSwitch {

	void init(String sdkKey, String serverUrl);

	void destroy();

	<T> T getFlag(String key, LSUser LSUser, Object defaultValue);

	Boolean getBooleanFlag(String key, LSUser LSUser, Boolean defaultValue);

	Integer getNumberFlag(String key, LSUser LSUser, Integer defaultValue);

	String getStringFlag(String key, LSUser LSUser, String defaultValue);

	static LightSwitch getInstance() {
		return LightSwitchImpl.getInstance();
	}
}
