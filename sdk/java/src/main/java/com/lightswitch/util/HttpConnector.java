package com.lightswitch.util;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import com.lightswitch.exception.FlagServerConnectException;

public class HttpConnector {
	private static final String API_PATH = "/api/v1/";

	public HttpURLConnection getConnect(String serverUrl, String endPoint, String httpMethod, int connectTime,
		boolean isSSE) throws
		FlagServerConnectException {
		try {
			URL url = new URL(serverUrl + API_PATH + endPoint);
			HttpURLConnection connection = (HttpURLConnection)url.openConnection();
			connection.setDoOutput(true);
			connection.setRequestMethod(httpMethod);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setReadTimeout(connectTime);
			if (isSSE) {
				connection.setRequestProperty("Accept", "text/event-stream");
			}
			return connection;
		} catch (IOException e) {
			throw new FlagServerConnectException("Failed To Connect Flag Server");
		}
	}
}
