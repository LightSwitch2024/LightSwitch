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
import com.lightswitch.domain.dto.Config;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.LSUser;
import com.lightswitch.domain.dto.BaseResponse;
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

	private HttpURLConnection connection;
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
		HttpURLConnection initConnection = setupPostConnection("sdk/init", sdkKey);
		getAllFlags(initConnection);

		HttpURLConnection subscribeConnection = setupPostConnection("sse/subscribe", sdkKey);
		userKey = getUserKey(subscribeConnection);

		connection = setupGetConnection(serverUrl, "sse/subscribe/" + userKey);
		connectToSse();
	}

	private String getUserKey(HttpURLConnection subscribeConnection) throws FlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<UserKeyResponse>>() {
		}.getType();
		BaseResponse<UserKeyResponse> response = handleResponse(subscribeConnection, responseType);
		if (response.getCode() != HttpURLConnection.HTTP_OK) {
			throw new FlagServerConnectException("Failed To Connect Flag Server : Invalid SDK key");
		}
		return response.getData().getUserKey();
	}

	private void getAllFlags(HttpURLConnection initConnection) throws FlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<List<FlagResponse>>>() {
		}.getType();
		BaseResponse<List<FlagResponse>> response = handleResponse(initConnection, responseType);
		if (response.getCode() != HttpURLConnection.HTTP_OK) {
			throw new FlagServerConnectException("Failed To Connect Flag Server : Invalid SDK key");
		}
		Flags.addAllFlags(response.getData());
	}

	private HttpURLConnection setupPostConnection(String endpoint, String sdkKey) throws
		FlagRuntimeException {
		HttpConnector connector = new HttpConnector();
		HttpURLConnection connection = connector.getConnect(hostUrl, endpoint, "POST", 0, false);
		return writeSdkKey(connection, sdkKey);
	}

	private <T> T handleResponse(HttpURLConnection connection, Type responseType) throws FlagServerConnectException {
		Gson gson = new Gson();
		String response = readResponse(connection);
		return gson.fromJson(response, responseType);
	}

	private String readResponse(HttpURLConnection connection) throws FlagServerConnectException {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(connection.getInputStream(), UTF_8))) {
			StringBuilder response = new StringBuilder();
			String line;
			while (Objects.nonNull(line = reader.readLine())) {
				response.append(line.trim());
			}
			return response.toString();
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed To Read Response");
		}
	}

	private HttpURLConnection setupGetConnection(String serverUrl, String endpoint) throws FlagServerConnectException {
		HttpConnector connector = new HttpConnector();
		return connector.getConnect(serverUrl, endpoint, "GET", 0, true);
	}

	private HttpURLConnection writeSdkKey(HttpURLConnection connection, String sdkKey) throws
		FlagServerConnectException {
		try (OutputStream os = connection.getOutputStream()) {
			Gson gson = new Gson();
			String json = gson.toJson(new Config(sdkKey));
			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection;
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed To send SDK key");
		}
	}

	private void connectToSse() throws FlagServerConnectException {
		Runnable task = () -> {
			try(BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
				String inputLine;
				StringBuilder dataBuffer = new StringBuilder();
				connection.setReadTimeout(3);

				while (!Thread.interrupted() && (inputLine = in.readLine()) != null) {
					if (inputLine.startsWith("data:")) {
						dataBuffer.append(inputLine.substring(5));
					} else if (inputLine.isEmpty()) {
						String jsonData = dataBuffer.toString().trim();
						processJsonData(jsonData);
						dataBuffer = new StringBuilder();  // 버퍼 초기화
					}
				}
			} catch (IOException io) {
				throw new FlagServerConnectException("Failed To Read Response");
			}
		};

		thread = new Thread(task);
		thread.start();
	}

	private void processJsonData(String jsonData) {
		int jsonStartIndex = jsonData.indexOf('{');
		if (jsonStartIndex != -1) {
			jsonData = jsonData.substring(jsonStartIndex);
			Gson gson = new Gson();
			SseResponse sseResponse = gson.fromJson(jsonData, SseResponse.class);
			Flags.event(sseResponse);
		}
		System.out.println("Received: " + jsonData);
	}

	@Override
	public void destroy() {
		if (thread != null) {
			thread.interrupt();
			thread = null;
			setupDeleteConnection("sse/disconnect");
		}
		Flags.clear();
	}

	private void setupDeleteConnection(String endpoint) throws FlagServerConnectException {
		try {
			HttpConnector connector = new HttpConnector();
			HttpURLConnection delete = connector.getConnect(hostUrl, endpoint, "DELETE", 0, false);
			if (requestDisconnect(delete, userKey).getResponseCode() != HttpURLConnection.HTTP_OK) {
				throw new FlagServerConnectException();
			}
		} catch (IOException e) {
			throw new FlagServerConnectException();
		}
	}

	private HttpURLConnection requestDisconnect(HttpURLConnection connection, String userKey) throws
		FlagServerConnectException {
		try (OutputStream os = connection.getOutputStream()) {
			Gson gson = new Gson();
			String json = gson.toJson(new UserKeyRequest(userKey));
			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection;
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed To send SDK key");
		}
	}

	@Override
	public <T> T getFlag(String key, LSUser LSUser) throws FlagRuntimeException {
		//todo. 세 번째 인자 default 값 추가하기
		Flag flag = Flags.getFlag(key).orElseThrow(() -> new FlagNotFoundException("Flag Not Found Exception"));
		return flag.getValue(LSUser);
	}

	@Override
	public Boolean getBooleanFlag(String key, LSUser LSUser) throws FlagRuntimeException {
		try {
			return getFlag(key, LSUser);
		} catch (ClassCastException e) {
			throw new FlagValueCastingException("Flag Value Type is Not Boolean");
		}
	}

	@Override
	public Integer getNumberFlag(String key, LSUser LSUser) throws FlagRuntimeException {
		try {
			return getFlag(key, LSUser);
		} catch (ClassCastException e) {
			throw new FlagValueCastingException("Flag Value Type is Not Number");
		}
	}

	@Override
	public String getStringFlag(String key, LSUser LSUser) throws FlagRuntimeException {
		try {
			return getFlag(key, LSUser);
		} catch (ClassCastException e) {
			throw new FlagValueCastingException("Flag Value Type is Not String");
		}
	}
}
