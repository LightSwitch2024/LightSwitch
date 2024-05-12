package com.lightswitch.util;

import static org.assertj.core.api.AssertionsForClassTypes.*;
import static org.mockito.Mockito.*;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.google.gson.reflect.TypeToken;
import com.lightswitch.domain.dto.BaseResponse;
import com.lightswitch.exception.LSServerException;
import com.lightswitch.impl.SseCallback;

@ExtendWith(MockitoExtension.class)
class LSConnectorTest {

	@Mock
	private HttpURLConnection mockConnection;
	@Mock
	private OutputStream mockOutputStream;
	@Mock
	private URL mockURL;
	@Mock
	private SseCallback mockCallback;

	@Test
	void testSetup() {
		LSConnector connector = new LSConnector("http://test.com");
		HttpURLConnection connection = connector.setup("testEndpoint", "GET", false);
		assertThat(connection).isNotNull();
	}

	@Test
	void getConnection_설정_테스트() throws Exception {
		LSConnector connector = new LSConnector("http://test.com");

		when(mockURL.openConnection()).thenReturn(mockConnection);
		Method getConnection = LSConnector.class.getDeclaredMethod("getConnection", URL.class, String.class, int.class,
			boolean.class);
		getConnection.setAccessible(true);

		HttpURLConnection returnedConnection = (HttpURLConnection)getConnection.invoke(connector, mockURL, "POST", 1000,
			false);

		assertThat(returnedConnection).isNotNull();
		verify(mockConnection).setDoOutput(true);
		verify(mockConnection).setRequestMethod("POST");
		verify(mockConnection).setRequestProperty("Content-Type", "application/json");
		verify(mockConnection).setReadTimeout(1000);
	}

	@Test
	void getConnection_SSE설정_테스트() throws Exception {
		LSConnector connector = new LSConnector("http://test.com");

		when(mockURL.openConnection()).thenReturn(mockConnection);
		Method getConnection = LSConnector.class.getDeclaredMethod("getConnection", URL.class, String.class, int.class,
			boolean.class);
		getConnection.setAccessible(true);

		HttpURLConnection returnedConnection = (HttpURLConnection)getConnection.invoke(connector, mockURL, "GET", 1000,
			true);

		assertThat(returnedConnection).isNotNull();
		verify(mockConnection).setDoOutput(true);
		verify(mockConnection).setRequestMethod("GET");
		verify(mockConnection).setRequestProperty("Content-Type", "application/json");
		verify(mockConnection).setRequestProperty("Accept", "text/event-stream");
		verify(mockConnection).setReadTimeout(1000);
	}

	@Test
	void sendData_전송성공_테스트() throws Exception {
		//given
		HttpURLConnection mockConnection = mock(HttpURLConnection.class);
		OutputStream mockOutput = mock(OutputStream.class);
		when(mockConnection.getOutputStream()).thenReturn(mockOutput);

		//when
		LSConnector connector = new LSConnector("http://test.com");
		connector.sendData(mockConnection, new Object());

		//then
		verify(mockOutput).write(any(byte[].class), eq(0), anyInt());
		verify(mockConnection).getResponseCode();
	}

	@Test
	void sendData_전송실패_테스트() throws Exception {
		//given
		LSConnector connector = new LSConnector("http://test.com");
		when(mockConnection.getOutputStream()).thenReturn(mockOutputStream);

		//when
		doThrow(new IOException()).when(mockOutputStream).write(any(byte[].class), eq(0), anyInt());

		//then
		assertThatThrownBy(() -> {
			connector.sendData(mockConnection, new Object());
		}).isInstanceOf(LSServerException.class);
		verify(mockConnection, never()).getResponseCode();
	}

	@Test
	void getResponse_테스트() throws Exception {
		LSConnector connector = new LSConnector("http://test.com");

		String jsonResponse = "{\"code\":200, \"message\":\"OK\", \"data\":\"Success\"}";
		InputStream stream = new ByteArrayInputStream(jsonResponse.getBytes());
		when(mockConnection.getInputStream()).thenReturn(stream);

		Type responseType = new com.google.gson.reflect.TypeToken<BaseResponse<String>>() {
		}.getType();

		String result = connector.getResponse(mockConnection, responseType);
		assertThat(result).isEqualTo("Success");
	}

	@Test
	void parseResponse_data_파싱_테스트() throws Exception {
		String input = "event:sse\ndata:some data\n";
		BufferedReader reader = new BufferedReader(new StringReader(input));
		LSConnector connector = new LSConnector("http://test.com");

		Method parseResponse = LSConnector.class.getDeclaredMethod("parseResponse", BufferedReader.class);
		parseResponse.setAccessible(true);

		String result = (String)parseResponse.invoke(connector, reader);
		assertThat(result).isEqualTo("some data");
	}

	@Test
	void parseResponse_event_disconnect_파싱_테스트() throws Exception {
		String input = "event:disconnect\ndata:some data\n";
		BufferedReader reader = new BufferedReader(new StringReader(input));
		LSConnector connector = new LSConnector("http://test.com");

		Method parseResponse = LSConnector.class.getDeclaredMethod("parseResponse", BufferedReader.class);
		parseResponse.setAccessible(true);

		String result = (String)parseResponse.invoke(connector, reader);
		assertThat(result).isEqualTo("");
	}

	@Test
	void parseResponse_SSE_connected_파싱_테스트() throws Exception {
		String input = "event:sse\ndata:SSE connected\n";
		BufferedReader reader = new BufferedReader(new StringReader(input));
		LSConnector connector = new LSConnector("http://test.com");

		Method parseResponse = LSConnector.class.getDeclaredMethod("parseResponse", BufferedReader.class);
		parseResponse.setAccessible(true);

		String result = (String)parseResponse.invoke(connector, reader);
		assertThat(result).isEqualTo("");
	}

	@Test
	void handleResponse_테스트() throws Exception {
		LSConnector connector = new LSConnector("http://test.com");
		when(mockConnection.getInputStream()).thenReturn(
			new ByteArrayInputStream("{\"code\":\"123\",\"message\":\"mess\",\"data\":\"value\"}".getBytes()));

		Method handleResponse = LSConnector.class.getDeclaredMethod("handleResponse", HttpURLConnection.class,
			Type.class);
		handleResponse.setAccessible(true);

		Type responseType = new TypeToken<BaseResponse<String>>() {
		}.getType();
		BaseResponse<String> response = (BaseResponse<String>)handleResponse.invoke(connector, mockConnection,
			responseType);

		assertThat(response).isNotNull();
		assertThat(response.getData()).isEqualTo("value");
		assertThat(response.getCode()).isEqualTo(123);
	}

	@Test
	void createSseRunnable_요청1회_테스트() throws Exception {
		String sseData = "event:data\ndata: message2\n\n";
		InputStream stream = new ByteArrayInputStream(sseData.getBytes(StandardCharsets.UTF_8));
		when(mockConnection.getInputStream()).thenReturn(stream);

		LSConnector connector = new LSConnector("http://test.com");
		Runnable sseRunnable = connector.createSseRunnable(mockConnection, mockCallback);

		Thread thread = new Thread(sseRunnable);
		thread.start();
		Thread.sleep(500);
		assertThat(thread.isAlive()).isTrue();


		thread.interrupt();
		thread.join();

		verify(mockCallback, times(1)).onSseReceived(anyString());
		assertThat(thread.isAlive()).isFalse();
	}

	@Test
	void createSseRunnable_요청2회_테스트() throws Exception {
		String sseData = "event:data\ndata: message2\nevent:disconnect\ndata: disconnect\n\n";
		InputStream stream = new ByteArrayInputStream(sseData.getBytes(StandardCharsets.UTF_8));
		when(mockConnection.getInputStream()).thenReturn(stream);

		LSConnector connector = new LSConnector("http://test.com");
		Runnable sseRunnable = connector.createSseRunnable(mockConnection, mockCallback);

		Thread thread = new Thread(sseRunnable);
		thread.start();
		Thread.sleep(500);
		assertThat(thread.isAlive()).isTrue();

		thread.interrupt();
		thread.join();

		verify(mockCallback, times(2)).onSseReceived(anyString());
		assertThat(thread.isAlive()).isFalse();
	}
}