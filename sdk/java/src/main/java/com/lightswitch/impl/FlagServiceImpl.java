package com.lightswitch.impl;

import static java.net.HttpURLConnection.*;
import static java.nio.charset.StandardCharsets.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;

import com.google.gson.Gson;
import com.lightswitch.domain.Context;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.dto.InitResponse;
import com.lightswitch.domain.dto.SseResponse;
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

		if (!setupConnection("connect", sdkKey)) {
			throw new FlagServerConnectException("SSE() POST request not worked");
		}
		startSseThread();
	}

	private boolean setupConnection(String endpoint, String sdkKey) {
		SseServlet servlet = new SseServlet();
		connection = servlet.getConnect(endpoint, "POST", 0);
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
			InitResponse initResponse = gson.fromJson(response.toString(), InitResponse.class);

			Flags.addAllFlags(initResponse);
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

	private void processEventData(String jsonData) {
		Gson gson = new Gson();
		SseResponse sseResponse = gson.fromJson(jsonData, SseResponse.class);
		// todo. update,delete,, .. flag 관리
		System.out.println("Received data: " + sseResponse.toString());
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
		flagService.init("SDK_key");

		Context build = new Context.Builder(123)
			.build();

		Object testTitle = flagService.getFlag("title1", build);
	}
}
