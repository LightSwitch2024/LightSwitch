package com.lightswitch.domain;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import com.lightswitch.domain.dto.FlagResponse;

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
	void Flags_deleteFlag_테스트() {
		Flag flag = getFlag();
		Flags.addFlag(flag);
		Flags.deleteFlag(flag.getTitle());

		assertFalse(Flags.getFlag(flag.getTitle()).isPresent());
	}

	@Test
	void Flags_clear_테스트() {
		Flag flag = getFlag();
		Flags.addFlag(flag);
		Flags.clear();

		assertTrue(Flags.getFlag(flag.getTitle()).isEmpty());
	}

	private Flag getFlag() {
		return new Flag(1, "Flag", "", FlagType.BOOLEAN, null, "true", 0,
			"", null, 1, "2020-01-01", "2021-01-01", null, true);
	}
}
