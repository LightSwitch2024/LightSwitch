package com.lightswitch.impl;

import com.lightswitch.domain.LSUser;

public interface FlagService {

	void init(String sdkKey);

	void destroy();

	<T> T getFlag(String key, LSUser LSUser);

	Boolean getBooleanFlag(String key, LSUser LSUser);

	Integer getNumberFlag(String key, LSUser LSUser);

	String getStringFlag(String key, LSUser LSUser);
}
