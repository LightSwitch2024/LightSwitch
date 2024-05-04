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
import com.lightswitch.exception.InvalidSSEFormatException;
import com.lightswitch.util.HttpConnector;

public class LightSwitch implements FlagService {

	private HttpURLConnection connection;
	private Thread thread;

	private LightSwitch() {
	}

	private static class LightSwitchHolder {
		private static final LightSwitch INSTANCE = new LightSwitch();
	}

	public static LightSwitch getInstance() {
		return LightSwitchHolder.INSTANCE;
	}

	@Override
	public void init(String sdkKey) throws FlagRuntimeException {
		HttpURLConnection initConnection = setupPostConnection("sdk/init", sdkKey);
		getAllFlags(initConnection);

		HttpURLConnection subscribeConnection = setupPostConnection("sse/subscribe", sdkKey);
		String userKey = getUserKey(subscribeConnection);
		System.out.println(userKey);

		connection = setupGetConnection("sse/subscribe/" + userKey);
		thread = new Thread(this::connectToSse);
		thread.start();
	}

	private String getUserKey(HttpURLConnection subscribeConnection) throws FlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<UserKeyResponse>>() {
		}.getType();
		BaseResponse<UserKeyResponse> response = handleResponse(subscribeConnection, responseType);
		if (response.getCode() != HttpURLConnection.HTTP_OK) {
			throw new FlagServerConnectException("Failed To Connect Flag Server");
		}
		return response.getData().getUserKey();
	}

	private void getAllFlags(HttpURLConnection initConnection) throws FlagRuntimeException {
		Type responseType = new TypeToken<BaseResponse<List<FlagResponse>>>() {
		}.getType();
		BaseResponse<List<FlagResponse>> response = handleResponse(initConnection, responseType);
		if (response.getCode() != HttpURLConnection.HTTP_OK) {
			throw new FlagServerConnectException("Failed To Connect Flag Server");
		}
		Flags.addAllFlags(response.getData());
	}

	private HttpURLConnection setupPostConnection(String endpoint, String sdkKey) throws FlagRuntimeException {
		HttpConnector connector = new HttpConnector();
		HttpURLConnection connection = connector.getConnect(endpoint, "POST", 0, false);
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

	private HttpURLConnection setupGetConnection(String endpoint) throws FlagServerConnectException {
		HttpConnector connector = new HttpConnector();
		return connector.getConnect(endpoint, "GET", 0, true);
	}

	private HttpURLConnection writeSdkKey(HttpURLConnection connection, String sdkKey) throws
		InvalidSSEFormatException {
		try {
			OutputStream os = connection.getOutputStream();
			Gson gson = new Gson();
			String json = gson.toJson(new Config(sdkKey));

			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
		} catch (IOException e) {
			throw new InvalidSSEFormatException("Failed To send SDK key");
		}
		return connection;
	}

	private void connectToSse() throws InvalidSSEFormatException {
		try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
			String inputLine;
			StringBuffer dataBuffer = new StringBuffer();

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
						dataBuffer = new StringBuffer();
					}
				}
			}
		} catch (IOException io) {
			throw new InvalidSSEFormatException("Failed To Read Response");
		}
	}

	@Override
	public void destroy() {
		if (thread != null) {
			thread.interrupt();
			try {
				thread.join();
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}
		if (connection != null) {
			connection.disconnect();
		}

		Flags.clear();
	}

	@Override
	public <T> T getFlag(String key, LSUser LSUser) {
		//todo. 세 번째 인자 default 값 추가하기
		Flag flag = Flags.getFlag(key).orElseThrow(FlagNotFoundException::new);
		return flag.getValue(LSUser);
	}

	@Override
	public Boolean getBooleanFlag(String key, LSUser LSUser) {
		return getFlag(key, LSUser);
	}

	@Override
	public Integer getNumberFlag(String key, LSUser LSUser) {
		return getFlag(key, LSUser);
	}

	@Override
	public String getStringFlag(String key, LSUser LSUser) {
		return getFlag(key, LSUser);
	}

	public static void main(String[] args) {
		FlagService flagService = LightSwitch.getInstance();
		flagService.init("d8d2d76fc0514279b00c82bf9515f66d");

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}

		LSUser build = new LSUser.Builder(123)
			.property("blog", "https://olrlobt.tistory.com/")
			.build();

		LSUser build2 = new LSUser.Builder(123)
			.property("kk", "aab")
			.build();

		Object testTitle = flagService.getFlag("img5", build);
		Object testTitle2 = flagService.getFlag("img5", build2);
		System.out.println(testTitle + " // " + testTitle2);

		try {
			Thread.sleep(6000);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}

		Object testTitle3 = flagService.getFlag("img5", build);
		Object testTitle4 = flagService.getFlag("img5", build2);
		System.out.println(testTitle3 + " // " + testTitle4);
	}
}
