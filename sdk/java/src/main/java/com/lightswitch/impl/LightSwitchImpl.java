package com.lightswitch.impl;

import static java.nio.charset.StandardCharsets.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.util.List;
import java.util.Objects;

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
import com.lightswitch.exception.FlagNotFoundException;
import com.lightswitch.exception.FlagRuntimeException;
import com.lightswitch.exception.FlagServerConnectException;
import com.lightswitch.exception.FlagValueCastingException;
import com.lightswitch.util.HttpConnector;

public class LightSwitchImpl implements LightSwitch {

	private Thread thread;
	private String hostUrl;
	private String userKey;

	private LightSwitchImpl() {
	}

	private static class LightSwitchHolder {
		private static final LightSwitchImpl INSTANCE = new LightSwitchImpl();
	}

	protected static LightSwitchImpl getInstance() {
		return LightSwitchHolder.INSTANCE;
	}

	@Override
	public void init(String sdkKey, String serverUrl) throws FlagRuntimeException {
		if (thread != null && thread.isAlive()) {
			return;
		}
		destroy();

		hostUrl = serverUrl;

		HttpURLConnection initConnection = setupConnection("sdk/init", "POST", false);
		sendData(initConnection, new Config(sdkKey));
		getAllFlags(initConnection);

		HttpURLConnection subscribeConnection = setupConnection("sse/subscribe", "POST", false);
		sendData(subscribeConnection, new Config(sdkKey));
		userKey = getUserKey(subscribeConnection);

		HttpURLConnection connection = setupConnection("sse/subscribe/" + userKey, "GET", true);
		connectToSse(connection);
	}

	private HttpURLConnection setupConnection(String endpoint, String method, boolean isSSE) throws
		FlagServerConnectException {
		return new HttpConnector().getConnect(hostUrl, endpoint, method, 0, isSSE);
	}

	private void getAllFlags(HttpURLConnection initConnection) throws FlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<List<FlagResponse>>>() {
		}.getType();
		List<FlagResponse> flags = processConnectionResponse(initConnection, responseType);
		Flags.addAllFlags(flags);
	}

	private String getUserKey(HttpURLConnection subscribeConnection) throws FlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<UserKeyResponse>>() {
		}.getType();
		UserKeyResponse userKeyResponse = processConnectionResponse(subscribeConnection, responseType);
		return userKeyResponse.getUserKey();
	}

	private <T> T processConnectionResponse(HttpURLConnection connection, Type responseType) throws
		FlagRuntimeException {
		BaseResponse<T> response = handleResponse(connection, responseType);
		if (response.getCode() != HttpURLConnection.HTTP_OK) {
			throw new FlagServerConnectException("Failed To Connect Flag Server : Invalid SDK key");
		}
		return response.getData();
	}

	private <T> T handleResponse(HttpURLConnection connection, Type responseType) throws FlagServerConnectException {
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), UTF_8))) {
			String response = parsingResponse(reader);
			return getJsonObject(response, responseType);
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed To Read Response");
		}
	}

	private <T> T getJsonObject(String jsonData, Type responseType) {
		return new Gson().fromJson(jsonData, responseType);
	}

	private int sendData(HttpURLConnection connection, Object body) throws
		FlagServerConnectException {
		try (OutputStream os = connection.getOutputStream()) {
			String json = new Gson().toJson(body);
			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection.getResponseCode();
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed To send SDK key");
		}
	}

	private void connectToSse(HttpURLConnection connection) throws FlagServerConnectException {
		Runnable task = () -> {
			try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(connection.getInputStream(), UTF_8))) {

				while (!Thread.interrupted()) {
					String sseResponse = parsingResponse(reader);
					processJsonData(sseResponse);
				}
			} catch (IOException io) {
				throw new FlagServerConnectException("Failed To Read Response");
			}
		};

		thread = new Thread(task);
		thread.start();
	}

	private void processJsonData(String jsonData) {
		if (jsonData.isEmpty()) {
			return;
		}
		SseResponse sseResponse = getJsonObject(jsonData, SseResponse.class);
		Flags.event(sseResponse);
	}

	private String parsingResponse(BufferedReader reader) throws IOException {
		StringBuilder response = new StringBuilder();
		String inputLine;
		while (Objects.nonNull(inputLine = reader.readLine())) {
			if (inputLine.startsWith("event:")) {
				if (inputLine.substring(6).contains("disconnect")) {
					break;
				}
			} else if (inputLine.startsWith("data:")) {
				inputLine = inputLine.substring(5);
				if (inputLine.contains("SSE connected")) {
					break;
				}
				response.append(inputLine);
			} else {
				response.append(inputLine.trim());
				break;
			}
		}
		return response.toString();
	}

	@Override
	public void destroy() {
		if (thread != null) {
			thread.interrupt();
			thread = null;
			HttpURLConnection disconnectConnection = setupConnection("sse/disconnect", "DELETE", false);
			if (sendData(disconnectConnection, new UserKeyRequest(userKey)) != HttpURLConnection.HTTP_OK) {
				throw new FlagServerConnectException("SDK 서버에 연결할 수 없습니다.");
			}
		}
		Flags.clear();
	}

	@Override
	public <T> T getFlag(String key, LSUser LSUser, Object defaultValue) throws FlagRuntimeException {
		try {
			Flag flag = Flags.getFlag(key).orElseThrow(() -> new FlagNotFoundException("Flag Not Found Exception"));
			return flag.getValue(LSUser);
		} catch (FlagNotFoundException e) {
			return (T)defaultValue;
		}
	}

	@Override
	public Boolean getBooleanFlag(String key, LSUser LSUser, Boolean defaultValue) throws FlagRuntimeException {
		try {
			return getFlag(key, LSUser, defaultValue);
		} catch (ClassCastException e) {
			return defaultValue;
		}
	}

	@Override
	public Integer getNumberFlag(String key, LSUser LSUser, Integer defaultValue) throws FlagRuntimeException {
		try {
			return getFlag(key, LSUser, defaultValue);
		} catch (ClassCastException e) {
			return defaultValue;
		}
	}

	@Override
	public String getStringFlag(String key, LSUser LSUser, String defaultValue) throws FlagRuntimeException {
		try {
			return getFlag(key, LSUser, defaultValue);
		} catch (ClassCastException e) {
			return defaultValue;
		}
	}
}
