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
import com.lightswitch.domain.Config;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.LSUser;
import com.lightswitch.domain.dto.BaseResponse;
import com.lightswitch.domain.dto.FlagResponse;
import com.lightswitch.domain.dto.SseResponse;
import com.lightswitch.domain.dto.UserKeyResponse;
import com.lightswitch.exception.FlagNotFoundException;
import com.lightswitch.exception.FlagRuntimeException;
import com.lightswitch.exception.FlagServerConnectException;
import com.lightswitch.exception.FlagValueCastingException;
import com.lightswitch.exception.InvalidSSEFormatException;
import com.lightswitch.util.HttpConnector;

public class LightSwitchImpl implements LightSwitch {

	private HttpURLConnection connection;
	private Thread thread;

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
		HttpURLConnection initConnection = setupPostConnection("sdk/init", sdkKey, serverUrl);
		getAllFlags(initConnection);

		HttpURLConnection subscribeConnection = setupPostConnection("sse/subscribe", sdkKey, serverUrl);
		String userKey = getUserKey(subscribeConnection);
		System.out.println(userKey);

		connection = setupGetConnection(serverUrl, "sse/subscribe/" + userKey);
		thread = new Thread(this::connectToSse);
		thread.start();
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

	private HttpURLConnection setupPostConnection(String endpoint, String sdkKey, String serverUrl) throws
		FlagRuntimeException {
		HttpConnector connector = new HttpConnector();
		HttpURLConnection connection = connector.getConnect(serverUrl, endpoint, "POST", 0, false);
		return writeSdkKey(connection, sdkKey);
	}

	private <T> T handleResponse(HttpURLConnection connection, Type responseType) throws InvalidSSEFormatException {
		Gson gson = new Gson();
		String response = readResponse(connection);
		return gson.fromJson(response, responseType);
	}

	private String readResponse(HttpURLConnection connection) throws InvalidSSEFormatException {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(connection.getInputStream(), UTF_8))) {
			StringBuilder response = new StringBuilder();
			String line;
			while (Objects.nonNull(line = reader.readLine())) {
				response.append(line.trim());
			}
			return response.toString();
		} catch (IOException e) {
			throw new InvalidSSEFormatException("Failed To Read Response");
		}
	}

	private HttpURLConnection setupGetConnection(String serverUrl, String endpoint) throws FlagServerConnectException {
		HttpConnector connector = new HttpConnector();
		return connector.getConnect(serverUrl, endpoint, "GET", 0, true);
	}

	private HttpURLConnection writeSdkKey(HttpURLConnection connection, String sdkKey) throws
		InvalidSSEFormatException {
		try (OutputStream os = connection.getOutputStream()) {
			Gson gson = new Gson();
			String json = gson.toJson(new Config(sdkKey));
			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection;
		} catch (IOException e) {
			throw new InvalidSSEFormatException("Failed To send SDK key");
		}
	}

	private void connectToSse() throws InvalidSSEFormatException {
		try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
			String inputLine;
			StringBuilder dataBuffer = new StringBuilder();

			while (!Thread.interrupted() && Objects.nonNull((inputLine = in.readLine()))) {
				if (inputLine.startsWith("data:")) {
					dataBuffer.append(inputLine.substring(5));
				} else if (inputLine.isEmpty()) {
					String jsonData = dataBuffer.toString().trim();
					System.out.println("Receive : " + jsonData);

					int jsonStartIndex = jsonData.indexOf('{');
					if (jsonStartIndex != -1) {

						jsonData = jsonData.substring(jsonStartIndex); // JSON 시작 지점부터 문자열 자르기
						Gson gson = new Gson();
						SseResponse sseResponse = gson.fromJson(jsonData, SseResponse.class);
						Flags.event(sseResponse);
						dataBuffer = new StringBuilder();
					}
				}
			}
		} catch (IOException io) {
			throw new InvalidSSEFormatException("Failed To Read Response");
		}
	}

	@Override
	public void destroy() {
		try {
			if (thread != null) {
				thread.interrupt();
				thread.join();
			}
			if (connection != null) {
				connection.disconnect();
			}
			Flags.clear();
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
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
