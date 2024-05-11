package com.lightswitch.domain;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.lightswitch.domain.dto.FlagResponse;
import com.lightswitch.domain.dto.SseResponse;
import com.lightswitch.domain.dto.SseType;

class FlagsTest {

	@Mock
	private FlagResponse mockFlagResponse;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void Flags_addAllFlags_테스트() {
		List<FlagResponse> flagResponses = new ArrayList<>();
		when(mockFlagResponse.getTitle()).thenReturn("Flag");
		when(mockFlagResponse.toFlag()).thenReturn(getFlag());

		flagResponses.add(mockFlagResponse);
		Flags.addAllFlags(flagResponses);

		assertTrue(Flags.getFlag("Flag").isPresent());
	}

	@Test
	void Flags_addFlag_테스트() {
		Flag flag = getFlag();
		Flags.addFlag(flag);

		assertEquals(flag, Flags.getFlag(flag.getTitle()).orElse(null));
	}

	@Test
	void Flags_addFlag_중복입력_테스트() {
		Flag flag = getFlag();
		Flags.addFlag(flag);
		Flag flag2 = getFlag2();
		Flags.addFlag(flag2);
		assertNotEquals(flag, Flags.getFlag(flag2.getTitle()).orElse(null));
	}

	@Test
	void Flags_deleteFlag_테스트() {
		Flag flag = getFlag();
		Flags.addFlag(flag);
		Flags.deleteFlag(flag.getTitle());

		assertFalse(Flags.getFlag(flag.getTitle()).isPresent());
	}

	@Test
	void Flags_deleteFlag_없는값_삭제_테스트() {
		Flags.clear();
		Flags.deleteFlag("없겠지");

		assertFalse(Flags.getFlag("없겠지").isPresent());
	}

	@Test
	void Flags_clear_테스트() {
		Flag flag = getFlag();
		Flags.addFlag(flag);
		Flags.clear();

		assertTrue(Flags.getFlag(flag.getTitle()).isEmpty());
	}

	@Test
	void Flags_getFlag_테스트() {
		Flags.clear();
		Flags.addFlag(getFlag());
		Optional<Flag> flag = Flags.getFlag("Flag");

		assertTrue(flag.isPresent());
		Flags.clear();
		Optional<Flag> flag2 = Flags.getFlag("Flag");
		assertTrue(flag2.isEmpty());
	}

	@Test
	void Flags_getFlag_예외_테스트() {
		Flags.clear();
		Optional<Flag> flag = Flags.getFlag("Flag2");
		assertThrows(NoSuchElementException.class, () -> {
			Flag flag1 = flag.get();
		});
	}

	@Test
	void Flags_switch_테스트() throws
		NoSuchMethodException,
		IllegalAccessException,
		NoSuchFieldException,
		InvocationTargetException {

		Flags.addFlag(getFlag());
		SseResponse response = getSseResponse(SseType.SWITCH);

		//when
		Method calValue = Flags.class.getDeclaredMethod("switchFlag", SseResponse.class);
		calValue.setAccessible(true);
		calValue.invoke(Flags.class, response);

		//then
		Flag flag = Flags.getFlag("Flag").orElseThrow();
		assertFalse(flag.isActive());
	}

	@Test
	void Flags_event_테스트() throws
		NoSuchMethodException,
		IllegalAccessException,
		NoSuchFieldException,
		InvocationTargetException {

		Flags.clear();

		SseResponse create1 = getSseResponse(SseType.CREATE);
		SseResponse update1 = getSseResponse(SseType.UPDATE);
		SseResponse switch1 = getSseResponse(SseType.SWITCH);
		SseResponse delete1 = getSseResponse(SseType.DELETE);

		Method calValue = Flags.class.getDeclaredMethod("event", SseResponse.class);
		calValue.setAccessible(true);

		//when
		calValue.invoke(Flags.class, create1);
		assertNotNull(Flags.getFlag("Flag"));

		calValue.invoke(Flags.class, update1);
		assertNotNull(Flags.getFlag("Flag"));

		calValue.invoke(Flags.class, switch1);
		assertFalse(Flags.getFlag("Flag").get().isActive());

		calValue.invoke(Flags.class, delete1);
		assertTrue(Flags.getFlag("Flag").isEmpty());
	}

	private SseResponse getSseResponse(SseType sseType) throws NoSuchFieldException, IllegalAccessException {
		//FlagResponse 생성
		FlagResponse flagResponse = new FlagResponse();
		Field title = FlagResponse.class.getDeclaredField("title");
		title.setAccessible(true); // 접근 제한 우회
		title.set(flagResponse, "Flag");
		Field active = FlagResponse.class.getDeclaredField("active");
		active.setAccessible(true); // 접근 제한 우회
		active.set(flagResponse, false);

		// SseResponse 생성
		SseResponse response = new SseResponse();
		Field typeField = SseResponse.class.getDeclaredField("type");
		typeField.setAccessible(true);
		typeField.set(response, sseType);
		Field dataField = SseResponse.class.getDeclaredField("data");
		dataField.setAccessible(true);
		dataField.set(response, flagResponse);
		return response;
	}

	private Flag getFlag() {
		return new Flag(1, "Flag", "", FlagType.BOOLEAN, List.of(), "true", 0,
			"", List.of(), 1, "2020-01-01", "2021-01-01", null, true);
	}

	private Flag getFlag2() {
		return new Flag(2, "Flag", "", FlagType.BOOLEAN, List.of(), "true", 0,
			"", List.of(), 1, "2020-01-01", "2021-01-01", null, true);
	}
}
