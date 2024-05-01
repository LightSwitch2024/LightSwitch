package com.lightswitch.util;

import java.net.HttpURLConnection;
import java.net.URL;

import com.lightswitch.exception.FlagServerConnectException;

public class SseServlet  {
	private static final String HOST_URL = "http://localhost:8000/api/v1/";

	public HttpURLConnection getConnect(String endPoint, String httpMethod, int connectTime) {
		try {
			URL url = new URL(HOST_URL + endPoint);
			return openConnection(url, httpMethod, connectTime, false);
		} catch (Exception e) {
			throw new FlagServerConnectException("Flag 서버 POST 요청 실패");
		}
	}

	public HttpURLConnection getSseConnect(String endPoint, String httpMethod, int connectTime) {
		try {
			URL url = new URL(HOST_URL + endPoint);
			return openConnection(url, httpMethod, connectTime, true);
		} catch (Exception e) {
			throw new FlagServerConnectException("Flag 서버 SSE 연결 실패");
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
