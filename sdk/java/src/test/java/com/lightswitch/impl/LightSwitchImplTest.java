package com.lightswitch.impl;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.google.gson.reflect.TypeToken;
import com.lightswitch.domain.Flag;
import com.lightswitch.domain.FlagType;
import com.lightswitch.domain.Flags;
import com.lightswitch.domain.LSUser;
import com.lightswitch.domain.dto.BaseResponse;
import com.lightswitch.domain.dto.FlagResponse;
import com.lightswitch.domain.dto.UserKeyResponse;
import com.lightswitch.exception.LSLSFlagNotFoundException;
import com.lightswitch.util.LSConnector;

@ExtendWith(MockitoExtension.class)
class LightSwitchImplTest {

	@Mock
	private LSConnector mockConnector;
	@Mock
	private HttpURLConnection mockHttpURLConnection;
	@Mock
	private Runnable mockRunnable;
	@Mock
	private Flag mockFlag;
	@Mock
	private LSUser mockLSUser;
	private MockedStatic<Flags> flagsMockedStatic;
	private LightSwitchImpl lightSwitch;

	@BeforeEach
	void makeFlag() {
		Mockito.reset(mockConnector);
		lightSwitch = LightSwitchImpl.getInstance(mockConnector);
		flagsMockedStatic = mockStatic(Flags.class);
	}

	@AfterEach
	void closeFlag() {
		flagsMockedStatic.close();
	}

	@Test
	void getInstance_테스트() {
		LightSwitch lightSwitch = LightSwitch.getInstance();
		LightSwitch lightSwitch2 = LightSwitch.getInstance();
		LightSwitch lightSwitch3 = LightSwitch.getInstance();

		assertThat(lightSwitch).isEqualTo(lightSwitch2);
		assertThat(lightSwitch2).isEqualTo(lightSwitch3);
		assertThat(lightSwitch).isEqualTo(lightSwitch3);
	}

	@Test
	void init_테스트() {
		when(mockConnector.setup(anyString(), anyString(), anyBoolean())).thenReturn(mockHttpURLConnection);
		when(mockConnector.sendData(any(HttpURLConnection.class), any())).thenReturn(200);

		Type allFlagsType = new TypeToken<BaseResponse<List<FlagResponse>>>() {
		}.getType();
		when(mockConnector.getResponse(any(HttpURLConnection.class), eq(allFlagsType))).thenReturn(
			Collections.emptyList());

		UserKeyResponse mockUserKey = mock(UserKeyResponse.class);
		when(mockUserKey.getUserKey()).thenReturn("mokUserKey");
		Type userKeyType = new TypeToken<BaseResponse<UserKeyResponse>>() {
		}.getType();
		when(mockConnector.getResponse(any(HttpURLConnection.class), eq(userKeyType))).thenReturn(mockUserKey);

		//when
		lightSwitch.init("sdkKey", "http://test.com");

		//then
		verify(mockConnector, atLeast(2)).setup(anyString(), anyString(), anyBoolean());
		verify(mockConnector, atLeast(2)).sendData(any(HttpURLConnection.class), any());
	}

	@Test
	void getAllFlags_테스트() throws Exception {
		when(mockConnector.getResponse(any(HttpURLConnection.class), any())).thenReturn(getAllFlags());
		Method allFlags = LightSwitchImpl.class.getDeclaredMethod("getAllFlags", HttpURLConnection.class);
		allFlags.setAccessible(true);

		assertThatCode(() -> allFlags.invoke(lightSwitch, mockHttpURLConnection)).doesNotThrowAnyException();

		Optional<Flag> expectedFlag = getFlag();
		flagsMockedStatic.when(() -> Flags.getFlag("title").orElseThrow()).thenReturn(expectedFlag);

		Flag flag = Flags.getFlag("title").orElseThrow();
		assertThat(flag).isNotNull();
		assertThat(flag.isActive()).isTrue();

		flagsMockedStatic.verify(() -> Flags.getFlag("title"), times(1));
	}

	private Optional<Flag> getFlag() {
		return Optional.of(new Flag(1, "Boolean Flag", "", FlagType.BOOLEAN, List.of(), "true", 0,
			"", List.of(), 1, "2020-01-01", "2021-01-01", null, true));
	}

	private List<FlagResponse> getAllFlags() throws Exception {
		List<FlagResponse> flagResponses = new ArrayList<>();
		Class<?> flagResponseClass = Class.forName("com.lightswitch.domain.dto.FlagResponse");

		Constructor<?> constructor = flagResponseClass.getConstructor();
		FlagResponse flagResponseInstance = (FlagResponse)constructor.newInstance();
		Field titleField = flagResponseClass.getDeclaredField("title");
		titleField.setAccessible(true);
		titleField.set(flagResponseInstance, "title");
		Field activeField = flagResponseClass.getDeclaredField("active");
		activeField.setAccessible(true);
		activeField.setBoolean(flagResponseInstance, true);

		flagResponses.add(flagResponseInstance);
		return flagResponses;
	}

	@Test
	void getUserKey_테스트() throws Exception {
		when(mockConnector.getResponse(any(HttpURLConnection.class), any())).thenReturn(getUserKey());

		Method userKeyResponse = LightSwitchImpl.class.getDeclaredMethod("getUserKey", HttpURLConnection.class);
		userKeyResponse.setAccessible(true);
		String userKey = (String)userKeyResponse.invoke(lightSwitch, mockHttpURLConnection);

		assertThat(userKey).isNotBlank();
		assertThat(userKey).isEqualTo("userKey");
	}

	private UserKeyResponse getUserKey() throws Exception {
		Class<?> UserKeyResponseClass = Class.forName("com.lightswitch.domain.dto.UserKeyResponse");
		Constructor<?> constructor = UserKeyResponseClass.getConstructor();
		UserKeyResponse userKeyResponse = (UserKeyResponse)constructor.newInstance();

		Field titleField = UserKeyResponseClass.getDeclaredField("userKey");
		titleField.setAccessible(true);
		titleField.set(userKeyResponse, "userKey");
		return userKeyResponse;
	}

	@Test
	public void onSseReceived_빈값_테스트() {
		String jsonData = "";

		lightSwitch.onSseReceived(jsonData);
		flagsMockedStatic.verify(() -> Flags.event(any()), times(0));
	}

	@Test
	public void onSseReceived_호출_테스트() {
		String jsonData = "{\"userKey\":\"1\",\"type\":\"CREATE\",\"data\":{}}";

		lightSwitch.onSseReceived(jsonData);
		flagsMockedStatic.verify(() -> Flags.event(any()), times(1));
	}

	// @Test
	// void destroy_whenThreadNotNull_shouldInterruptThreadAndSendData() {
	// 	Thread thread = mock(Thread.class);
	// 	// Setting up an internal state of LightSwitchImpl as thread is private and we assume it's set somewhere in the class.
	// 	ReflectionTestUtils.setField(lightSwitch, "thread", thread);
	//
	// 	when(mockConnector.setup("sse/disconnect", "DELETE", false)).thenReturn(mockHttpURLConnection);
	//
	// 	lightSwitch.destroy();
	//
	// 	verify(thread).interrupt();
	// 	verify(mockConnector).sendData(mockHttpURLConnection, any(UserKeyRequest.class));
	// 	verifyNoMoreInteractions(mockConnector); // Ensuring no other interactions
	// }

	@Test
	void getFlag_테스트() {
		flagsMockedStatic.when(() -> Flags.getFlag("feature")).thenReturn(Optional.of(mockFlag));
		when(mockFlag.getValue(mockLSUser)).thenReturn("true");

		String result = lightSwitch.getFlag("feature", mockLSUser, "false");

		assertThat(result).isEqualTo("true");
	}

	@Test
	void getFlag_Default_value_테스트() {
		flagsMockedStatic.when(() -> Flags.getFlag("feature")).thenThrow(LSLSFlagNotFoundException.class);

		Object flag = lightSwitch.getFlag("feature", mockLSUser, "answer");
		assertThat(flag).isEqualTo("answer");
	}

	@Test
	void getBooleanFlag_테스트() {
		flagsMockedStatic.when(() -> Flags.getFlag("feature")).thenReturn(Optional.of(mockFlag));
		when(mockFlag.getValue(mockLSUser)).thenReturn(true);

		Boolean result = lightSwitch.getBooleanFlag("feature", mockLSUser, false);

		assertThat(result).isTrue();
	}

	@Test
	void getNumberFlag_테스트() {
		flagsMockedStatic.when(() -> Flags.getFlag("number-feature")).thenReturn(Optional.of(mockFlag));
		when(mockFlag.getValue(mockLSUser)).thenReturn(42);

		Integer result = lightSwitch.getNumberFlag("number-feature", mockLSUser, 1);

		assertThat(result).isEqualTo(42);
	}

	@Test
	void getStringFlag_whenCalledInvokesGetFlag() {
		flagsMockedStatic.when(() -> Flags.getFlag("string-feature")).thenReturn(Optional.of(mockFlag));
		when(mockFlag.getValue(mockLSUser)).thenReturn("value");

		String result = lightSwitch.getStringFlag("string-feature", mockLSUser, "default");

		assertThat(result).isEqualTo("value");
	}
}