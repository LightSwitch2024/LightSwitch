package com.lightswitch.impl;

import com.lightswitch.domain.LSUser;

public interface FlagService {

	void init(String sdkKey);

	void destroy();

	<T> T getFlag(String key, LSUser LSUser);
}
