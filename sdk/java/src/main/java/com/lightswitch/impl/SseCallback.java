package com.lightswitch.impl;

public interface SseCallback {
	int onSseReceived(String jsonData);
}
