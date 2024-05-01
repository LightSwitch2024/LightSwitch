package com.lightswitch.impl;

import static java.net.HttpURLConnection.*;
import static java.nio.charset.StandardCharsets.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.lightswitch.domain.BaseResponse;
import com.lightswitch.domain.Config;
import com.lightswitch.domain.Context;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.dto.InitResponse;
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
		if (!setupPostConnection("sdk/init", sdkKey)) {
			throw new FlagServerConnectException("Init() POST request not worked");
		}
		handleResponse();

		if (!setupPostConnection("sse/subscribe", sdkKey)) {
			throw new FlagServerConnectException("Subscribe() POST request not worked");
		}
		String userKey = getUserKey();

		if (!setupGetConnection("sse/subscribe/" + userKey)) {
			throw new FlagServerConnectException("SSE() GET request not worked");
		}
		startSseThread();
	}


	private String getUserKey() {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(connection.getInputStream(), UTF_8))) {
			StringBuilder response = new StringBuilder();
			String line;
			while (Objects.nonNull(line = reader.readLine())) {
				response.append(line.trim());
			}

			Gson gson = new Gson();
			Type responseType = new TypeToken<BaseResponse<UserKeyResponse>>() {
			}.getType();
			BaseResponse<UserKeyResponse> userKey = gson.fromJson(response.toString(), responseType);

			return userKey.getData().getUserKey();
		} catch (IOException e) {
			throw new FlagRuntimeException("Failed to read response: " + e.getMessage(), e);
		}
	}

	private boolean setupPostConnection(String endpoint, String sdkKey) {
		SseServlet servlet = new SseServlet();
		connection = servlet.getConnect(endpoint, "POST", 0);
		return writeSdkKey(sdkKey) == HTTP_OK;
	}

	private boolean setupGetConnection(String endpoint) {
		SseServlet servlet = new SseServlet();
		connection = servlet.getSseConnect(endpoint, "GET", 0);

		return true;
	}

	private void handleResponse() {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(connection.getInputStream(), UTF_8))) {
			StringBuilder response = new StringBuilder();
			String line;
			while (Objects.nonNull(line = reader.readLine())) {
				response.append(line.trim());
			}

			Gson gson = new Gson();
			InitResponse initResponse = gson.fromJson(response.toString(), InitResponse.class);

			Flags.addAllFlags(initResponse);
		} catch (IOException e) {
			throw new FlagRuntimeException("Failed to read response: " + e.getMessage(), e);
		}
	}

	private int writeSdkKey(String sdkKey) {
		try (OutputStream os = connection.getOutputStream()) {
			Config config = new Config(sdkKey);
			Gson gson = new Gson();
			String json = gson.toJson(config);

			byte[] input = json.getBytes(StandardCharsets.UTF_8);
			os.write(input, 0, input.length);
			return connection.getResponseCode();
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed to send SDK key: " + e.getMessage(), e);
		}
	}

	private void startSseThread() {
		thread = new Thread(this::connectToSse);
		thread.start();
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
					System.out.println("Received: " + jsonData);
					if (!jsonData.isEmpty() && !jsonData.startsWith("SSE connected")) {
						processEventData(jsonData);
						dataBuffer = new StringBuffer();
					}
				}
			}
		} catch (IOException io) {
			throw new FlagRuntimeException("Error during SSE connection: " + io.getMessage(), io);
		}
	}

	private void processEventData(String jsonData) {
		Gson gson = new Gson();
		SseResponse sseResponse = gson.fromJson(jsonData, SseResponse.class);
		Flags.event(sseResponse);
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
	public Object getFlag(String key, Context context) {
		//todo. 세 번째 인자 default 값 추가하기
		Flag flag = Flags.getFlag(key).orElseThrow(FlagRuntimeException::new);
		return flag.getValue(context);
	}

	public static void main(String[] args) {
		FlagService flagService = FlagServiceImpl.getInstance();
		flagService.init("8030ca7d78fb464fb9b661a715bbab13");

		// Context build = new Context.Builder(123)
		// 	.build();

		// Object testTitle = flagService.getFlag("test", build);
		// System.out.println(testTitle);
	}
}
