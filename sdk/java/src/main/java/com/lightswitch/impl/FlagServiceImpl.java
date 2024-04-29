package com.lightswitch.impl;

import static java.net.HttpURLConnection.HTTP_OK;
import static java.nio.charset.StandardCharsets.UTF_8;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
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
		if (!setupConnection("init", sdkKey)) {
			throw new FlagServerConnectException("INIT() POST request not worked");
		}
		handleResponse();
	}

	private boolean setupConnection(String endpoint, String sdkKey) {
		SseServlet servlet = new SseServlet();
		connection = servlet.getConnect(endpoint, "POST", 1000);
		return writeSdkKey(sdkKey) == HTTP_OK;
	}

	private void handleResponse() {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(connection.getInputStream(), UTF_8))) {
			StringBuilder response = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				response.append(line.trim());
			}

			Gson gson = new Gson();
			Type listType = new TypeToken<List<Flag>>() {}.getType();
			List<Flag> flags = gson.fromJson(response.toString(), listType);

			Flags.addAllFlags(flags);
		} catch (IOException e) {
			throw new FlagRuntimeException("Failed to read response: " + e.getMessage(), e);
		}
	}

	private int writeSdkKey(String sdkKey) {
		try (OutputStream os = connection.getOutputStream()) {
			byte[] input = sdkKey.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection.getResponseCode();
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed to send SDK key: " + e.getMessage(), e);
		}
	}

	@Override
	public void sseConnection(String sdkKey) {
		if (!setupConnection("connect", sdkKey)) {
			throw new FlagServerConnectException("sse() POST request not worked");
		}
		startSseThread();
	}

	private void startSseThread() {
		thread = new Thread(this::connectToSse);
		thread.start();
	}

	private void connectToSse() {
		try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
			String inputLine;
			StringBuffer dataBuffer = new StringBuffer();

			while (!Thread.interrupted() && (inputLine = in.readLine()) != null) {
				if (inputLine.startsWith("data:")) {
					dataBuffer.append(inputLine.substring(5));
				} else if (inputLine.isEmpty()) {
					String jsonData = dataBuffer.toString().trim();
					if (!jsonData.isEmpty()) {
						processEventData(jsonData);
						dataBuffer = new StringBuffer();
					}
				}
			}
		} catch (IOException io) {
			throw new FlagRuntimeException("Error during SSE connection: " + io.getMessage(), io);
		}
	}

	private static void processEventData(String jsonData) {
		Gson gson = new Gson();
		Flag flag = gson.fromJson(jsonData, Flag.class);
		System.out.println("Received data: " + flag.toString() + ", number: " + flag.getTitle());
	}


	public static void main(String[] args) {
		FlagService flagService = FlagServiceImpl.getInstance();
		flagService.init("SDK_key");
		flagService.sseConnection("SDK_key");

		try {
			Thread.sleep(10000);
		} catch (InterruptedException ie) {
			Thread.currentThread().interrupt();
		}
	}
}
