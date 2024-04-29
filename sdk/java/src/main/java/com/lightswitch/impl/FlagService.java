package com.lightswitch.impl;

public interface FlagService {

	void init(String sdkKey);

	void sseConnection(String sdkKey);

	void destroy();

	void getFlag();

}
