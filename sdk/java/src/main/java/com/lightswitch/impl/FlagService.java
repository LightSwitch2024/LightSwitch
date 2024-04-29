package com.lightswitch.impl;

import com.lightswitch.domain.Context;

public interface FlagService {

	void init(String sdkKey);

	void sseConnection(String sdkKey);

	void destroy();

	Object getFlag(String key, Context context);

}
