package com.lightswitch.util;

import java.net.HttpURLConnection;
import java.net.URL;

import com.lightswitch.exception.FlagServerConnectException;

public class SseServlet  {
	private static final String HOST_URL = "http://localhost:8080/";

	public HttpURLConnection getConnect(String endPoint, String httpMethod, int connectTime) {
		try {
			URL url = new URL(HOST_URL + endPoint);
			return openConnection(url, httpMethod, connectTime);
		} catch (Exception e) {
			throw new FlagServerConnectException("Flag 서버에 연결할 수 없습니다.");
		}
	}

	protected HttpURLConnection openConnection(URL url, String httpMethod, int connectTime) throws Exception {
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setRequestMethod(httpMethod);
		connection.setRequestProperty("Content-Type", "text/plain");
		connection.setReadTimeout(connectTime);
		return connection;
	}
}
