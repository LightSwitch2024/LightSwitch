package com.lightswitch.impl;

public interface SseCallback {
	void onSseReceived(String jsonData);
}
