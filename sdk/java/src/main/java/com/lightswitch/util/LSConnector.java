package com.lightswitch.util;

import static java.nio.charset.StandardCharsets.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Objects;

import com.google.gson.Gson;
import com.lightswitch.domain.dto.BaseResponse;
import com.lightswitch.exception.LSFlagRuntimeException;
import com.lightswitch.exception.LSServerException;
import com.lightswitch.impl.SseCallback;

public class LSConnector {
	private static final String API_PATH = "/api/v1/";

	private String hostUrl;

	public LSConnector(String hostUrl) {
		this.hostUrl = hostUrl;
	}

	public HttpURLConnection setup(String endpoint, String method, boolean isSSE) throws
		LSServerException {
		try {
			URL url = new URL(hostUrl + API_PATH + endpoint);
			return getConnection(url, method, 0, isSSE);
		} catch (IOException e) {
			throw new LSServerException();
		}
	}

	private HttpURLConnection getConnection(URL url, String httpMethod, int connectTime,
		boolean isSSE) throws IOException {
		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
		conn.setDoOutput(true);
		conn.setRequestMethod(httpMethod);
		conn.setRequestProperty("Content-Type", "application/json");
		conn.setReadTimeout(connectTime);
		if (isSSE) {
			conn.setRequestProperty("Accept", "text/event-stream");
		}
		return conn;
	}

	public int sendData(HttpURLConnection connection, Object body) throws
		LSServerException {
		try (OutputStream os = connection.getOutputStream()) {
			String json = new Gson().toJson(body);
			byte[] input = json.getBytes(UTF_8);
			os.write(input, 0, input.length);
			return connection.getResponseCode();
		} catch (IOException e) {
			throw new LSServerException();
		}
	}

	public <T> T getResponse(HttpURLConnection connection, Type responseType) throws
		LSFlagRuntimeException {
		BaseResponse<T> response = handleResponse(connection, responseType);
		if (response.getCode() != HttpURLConnection.HTTP_OK) {
			throw new LSServerException();
		}
		return response.getData();
	}

	private <T> T handleResponse(HttpURLConnection connection, Type responseType) throws LSServerException {
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), UTF_8))) {
			String response = parseResponse(reader);
			return new Gson().fromJson(response, responseType);
		} catch (IOException e) {
			throw new LSServerException();
		}
	}

	private String parseResponse(BufferedReader reader) throws IOException {
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

	public Runnable createSseRunnable(HttpURLConnection sseConn, SseCallback callback) {
		return () -> {
			try (BufferedReader reader = new BufferedReader(new InputStreamReader(sseConn.getInputStream(), UTF_8))) {
				while (!Thread.interrupted()) {
					String sseResponse = parseResponse(reader);
					if (!sseResponse.isEmpty()) {
						callback.onSseReceived(sseResponse);
					}
				}
			} catch (IOException e) {
				throw new LSServerException();
			}
		};
	}
}
