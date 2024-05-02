package com.lightswitch.impl;

import static java.net.HttpURLConnection.*;
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
import com.lightswitch.domain.dto.BaseResponse;
import com.lightswitch.domain.Config;
import com.lightswitch.domain.LSUser;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.dto.FlagResponse;
import com.lightswitch.domain.dto.SseResponse;
import com.lightswitch.domain.dto.UserKeyResponse;
import com.lightswitch.exception.FlagRuntimeException;
import com.lightswitch.exception.FlagServerConnectException;
import com.lightswitch.util.SseServlet;

public class FlagServiceImpl implements FlagService {

	private HttpURLConnection connection;
	private Thread thread;

	private FlagServiceImpl() {
	}

	private static class FlagServiceHolder {
		private static final FlagServiceImpl INSTANCE = new FlagServiceImpl();
	}

	public static FlagServiceImpl getInstance() {
		return FlagServiceHolder.INSTANCE;
	}

	@Override
	public void init(String sdkKey) {
		HttpURLConnection initConnection = setupPostConnection("sdk/init", sdkKey);
		Type responseType = new TypeToken<BaseResponse<List<FlagResponse>>>() {}.getType();
		BaseResponse<List<FlagResponse>> response = handleResponse(initConnection, responseType);
		Flags.addAllFlags(response.getData());

		HttpURLConnection subscribeConnection = setupPostConnection("sse/subscribe", sdkKey);
		Type responseType2 = new TypeToken<BaseResponse<UserKeyResponse>>() {}.getType();
		BaseResponse<UserKeyResponse> response2 = handleResponse(subscribeConnection, responseType2);
		String userKey = response2.getData().getUserKey();
		System.out.println(userKey);

		connection = setupGetConnection("sse/subscribe/" + userKey);
		thread = new Thread(this::connectToSse);
		thread.start();
	}

	private HttpURLConnection setupPostConnection(String endpoint, String sdkKey) {
		SseServlet servlet = new SseServlet();
		HttpURLConnection connection = servlet.getConnect(endpoint, "POST", 0, false);

		if(writeSdkKey(connection, sdkKey) == HTTP_OK){
			return connection;
		}
		throw new FlagServerConnectException("Feature Flagging Server Connection Error");
	}

	private <T> T handleResponse(HttpURLConnection connection, Type responseType) {
		try {
			Gson gson = new Gson();
			String response = readResponse(connection);
			return gson.fromJson(response, responseType);
		} catch (IOException e) {
			throw new FlagRuntimeException("Failed to read response: " + e.getMessage(), e);
		}
	}

	private String readResponse(HttpURLConnection connection) throws IOException {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(connection.getInputStream(), UTF_8))) {
			StringBuilder response = new StringBuilder();
			String line;
			while (Objects.nonNull(line = reader.readLine())) {
				response.append(line.trim());
			}
			return response.toString();
		}
	}

	private HttpURLConnection setupGetConnection(String endpoint) {
		SseServlet servlet = new SseServlet();
		return servlet.getConnect(endpoint, "GET", 0, true);
	}


	private int writeSdkKey(HttpURLConnection connection, String sdkKey) {
		try (OutputStream os = connection.getOutputStream()) {
			Gson gson = new Gson();
			String json = gson.toJson(new Config(sdkKey));

			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection.getResponseCode();
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed to send SDK key: " + e.getMessage(), e);
		}
	}

	private void connectToSse() {
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
			throw new FlagRuntimeException("Error during SSE connection: " + io.getMessage(), io);
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
	public <T>T getFlag(String key, LSUser LSUser) {
		//todo. 세 번째 인자 default 값 추가하기
		Flag flag = Flags.getFlag(key).orElseThrow(FlagRuntimeException::new);
		return flag.getValue(LSUser);
	}

	public static void main(String[] args) {
		FlagService flagService = FlagServiceImpl.getInstance();
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
