package com.lightswitch.impl;

import com.lightswitch.domain.LSUser;

public interface LightSwitch {

	void init(String sdkKey, String serverUrl);

	void destroy();

	<T> T getFlag(String key, LSUser LSUser);

	Boolean getBooleanFlag(String key, LSUser LSUser);

	Integer getNumberFlag(String key, LSUser LSUser);

	String getStringFlag(String key, LSUser LSUser);

	static LightSwitch getInstance() {
		return LightSwitchImpl.getInstance();
	}
}
