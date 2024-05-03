package com.lightswitch.util;

import java.net.HttpURLConnection;
import java.net.URL;

import com.lightswitch.exception.FlagServerConnectException;

public class HttpConnector {
	private static final String HOST_URL = "http://localhost:8000/api/v1/";

	public HttpURLConnection getConnect(String endPoint, String httpMethod, int connectTime, boolean isSSE) {
		try {
			URL url = new URL(HOST_URL + endPoint);
			return openConnection(url, httpMethod, connectTime, isSSE);
		} catch (Exception e) {
			throw new FlagServerConnectException("Flag 서버 연결 실패");
		}
	}

	protected HttpURLConnection openConnection(URL url, String httpMethod, int connectTime, boolean isSSE) throws Exception {
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setRequestMethod(httpMethod);
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setReadTimeout(connectTime);
		if(isSSE){
			connection.setRequestProperty("Accept", "text/event-stream");
		}
		return connection;
	}
}
