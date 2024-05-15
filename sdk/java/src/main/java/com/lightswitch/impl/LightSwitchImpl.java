package com.lightswitch.impl;

import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.LSUser;
import com.lightswitch.domain.dto.BaseResponse;
import com.lightswitch.domain.dto.Config;
import com.lightswitch.domain.dto.FlagResponse;
import com.lightswitch.domain.dto.SseResponse;
import com.lightswitch.domain.dto.UserKeyRequest;
import com.lightswitch.domain.dto.UserKeyResponse;
import com.lightswitch.exception.LSFlagRuntimeException;
import com.lightswitch.exception.LSLSFlagNotFoundException;
import com.lightswitch.exception.LSServerException;
import com.lightswitch.util.LSConnector;

public class LightSwitchImpl implements LightSwitch, SseCallback {

	private Thread thread;
	private String userKey;
	private static LSConnector connector;

	private LightSwitchImpl() {
	}

	private static class LightSwitchHolder {
		private static final LightSwitchImpl INSTANCE = new LightSwitchImpl();
	}

	protected static LightSwitchImpl getInstance(LSConnector connector) {
		LightSwitchImpl.connector = connector;
		return LightSwitchHolder.INSTANCE;
	}

	@Override
	public void init(String sdkKey, String serverUrl) throws LSFlagRuntimeException {
		if (thread != null && thread.isAlive()) {
			return;
		}
		destroy();
		connector.setHostUrl(serverUrl);

		HttpURLConnection initConn = connector.setup("sdk/init", "POST", false);
		connector.sendData(initConn, new Config(sdkKey));
		getAllFlags(initConn);

		HttpURLConnection subscribeConn = connector.setup("sse/subscribe", "POST", false);
		connector.sendData(subscribeConn, new Config(sdkKey));
		userKey = getUserKey(subscribeConn);

		HttpURLConnection sseConn = connector.setup("sse/subscribe/" + userKey, "GET", true);
		connectToSse(sseConn);
	}

	private void getAllFlags(HttpURLConnection initConn) throws LSFlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<List<FlagResponse>>>() {
		}.getType();
		List<FlagResponse> flags = connector.getResponse(initConn, responseType);
		Flags.addAllFlags(flags);
	}

	private String getUserKey(HttpURLConnection subscribeConn) throws LSFlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<UserKeyResponse>>() {
		}.getType();
		UserKeyResponse userKeyResponse = connector.getResponse(subscribeConn, responseType);
		return userKeyResponse.getUserKey();
	}

	private void connectToSse(HttpURLConnection sseConn) throws LSServerException {
		Runnable task = connector.createSseRunnable(sseConn, this); //onSseReceived
		thread = new Thread(task);
		thread.start();
	}

	@Override
	public void onSseReceived(String jsonData) {
		if (jsonData.isEmpty()) {
			return;
		}
		Flags.event(new Gson().fromJson(jsonData, SseResponse.class));
	}

	@Override
	public void destroy() {
		if (thread != null) {
			thread.interrupt();
			thread = null;
			HttpURLConnection disconnectConnection = connector.setup("sse/disconnect", "DELETE", false);
			connector.sendData(disconnectConnection, new UserKeyRequest(userKey));
		}
		Flags.clear();
	}

	@Override
	public <T> T getFlag(String key, LSUser LSUser, Object defaultValue) throws LSFlagRuntimeException {
		try {
			Flag flag = Flags.getFlag(key).orElseThrow(() -> new LSLSFlagNotFoundException(key));
			return flag.getValue(LSUser);
		} catch (LSLSFlagNotFoundException e) {
			return (T)defaultValue;
		}
	}

	@Override
	public Boolean getBooleanFlag(String key, LSUser LSUser, Boolean defaultValue) throws LSFlagRuntimeException {
		try {
			return getFlag(key, LSUser, defaultValue);
		} catch (ClassCastException e) {
			return defaultValue;
		}
	}

	@Override
	public Integer getNumberFlag(String key, LSUser LSUser, Integer defaultValue) throws LSFlagRuntimeException {
		try {
			return getFlag(key, LSUser, defaultValue);
		} catch (ClassCastException e) {
			return defaultValue;
		}
	}

	@Override
	public String getStringFlag(String key, LSUser LSUser, String defaultValue) throws LSFlagRuntimeException {
		try {
			return getFlag(key, LSUser, defaultValue);
		} catch (ClassCastException e) {
			return defaultValue;
		}
	}
}
