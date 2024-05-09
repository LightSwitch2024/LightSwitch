package com.lightswitch.domain;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

public class FlagTest {

	private List<Keyword> keywords;
	private List<Variation> variations;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void 키워드_없는_Flag는_Portion으로_반환() {
		Flag noKeywordsFlag = getNoKeywordsFlag();

		Boolean booleanValue = noKeywordsFlag.getValue(getNoPropertyUser());
		Boolean booleanValue2 = noKeywordsFlag.getValue(getPropertyUser());

		assertFalse(booleanValue);
		assertFalse(booleanValue2);
	}

	@Test
	void 키워드_Flag는_키워드_Value로_반환() {
		Flag keywordsFlag = getKeywordsFlag();

		Boolean booleanValue = keywordsFlag.getValue(getNoPropertyUser());
		Boolean booleanValue2 = keywordsFlag.getValue(getPropertyUser());
		Boolean booleanValue3 = keywordsFlag.getValue(getDifPropertyUser());

		assertFalse(booleanValue);
		assertTrue(booleanValue2);
		assertFalse(booleanValue3);
	}

	@Test
	void 비활성화_Flag는_기본_값으로_반환() {
		Flag noKeywordsFlag = getNoKeywordsFlag();
		noKeywordsFlag.switchFlag(false);

		Boolean booleanValue = noKeywordsFlag.getValue(getNoPropertyUser());
		Boolean booleanValue2 = noKeywordsFlag.getValue(getPropertyUser());

		assertThat(booleanValue).isEqualTo(Boolean.parseBoolean(noKeywordsFlag.getDefaultValue()));
		assertThat(booleanValue2).isEqualTo(Boolean.parseBoolean(noKeywordsFlag.getDefaultValue()));
	}

	@Test
	void 비활성화_키워드_Flag는_기본_값으로_반환() {
		Flag keywordsFlag = getKeywordsFlag();
		keywordsFlag.switchFlag(false);

		Boolean booleanValue = keywordsFlag.getValue(getNoPropertyUser());
		Boolean booleanValue2 = keywordsFlag.getValue(getPropertyUser());

		assertThat(booleanValue).isEqualTo(Boolean.parseBoolean(keywordsFlag.getDefaultValue()));
		assertThat(booleanValue2).isEqualTo(Boolean.parseBoolean(keywordsFlag.getDefaultValue()));
	}

	@Test
	void Flag는_Value_타입으로_반환() {
		Flag booleanFlag = getFlagByType(FlagType.BOOLEAN,"true");
		Flag numberFlag = getFlagByType(FlagType.INTEGER, "1");
		Flag stringFlag = getFlagByType(FlagType.STRING, "string");

		Boolean booleanValue = booleanFlag.getValue(getNoPropertyUser());
		Integer numberValue = numberFlag.getValue(getNoPropertyUser());
		String stringValue = stringFlag.getValue(getNoPropertyUser());

		assertDoesNotThrow(() -> new Exception());
	}

	@Test
	void Flag는_Value_타입으로_반환_에러() {
		Flag booleanFlag = getFlagByType(FlagType.BOOLEAN,"true");
		Flag numberFlag = getFlagByType(FlagType.INTEGER, "1");
		Flag stringFlag = getFlagByType(FlagType.STRING, "string");

		assertThrows(ClassCastException.class, () -> {
			Integer value = booleanFlag.getValue(getNoPropertyUser());
			String value2 = booleanFlag.getValue(getNoPropertyUser());
		});
		assertThrows(ClassCastException.class, () -> {
			Boolean value = numberFlag.getValue(getNoPropertyUser());
			String value2 = numberFlag.getValue(getNoPropertyUser());
		});
		assertThrows(ClassCastException.class, () -> {
			Boolean value = stringFlag.getValue(getNoPropertyUser());
			Integer value2 = stringFlag.getValue(getNoPropertyUser());
		});
	}

	private Flag getNoKeywordsFlag() {
		keywords = List.of();
		variations = List.of(new Variation(0, "false", 100, "des1"));

		return new Flag(1, "Boolean Flag", "", FlagType.BOOLEAN, keywords, "true", 0,
			"", variations, 1, "2020-01-01", "2021-01-01", null, true);
	}

	private Flag getKeywordsFlag() {
		keywords = List.of(new Keyword(List.of(new Property("이름", "이승"), new Property("직급", "팀원")), "true"));
		variations = List.of(new Variation(0, "false", 100, "des1"));

		return new Flag(1, "Boolean Flag", "", FlagType.BOOLEAN, keywords, "true", 0,
			"", variations, 1, "2020-01-01", "2021-01-01", null, true);
	}

	private Flag getFlagByType(FlagType flagType ,String value) {
		return new Flag(1, "Flag", "", flagType, keywords, value, 0,
			"", variations, 1, "2020-01-01", "2021-01-01", null, true);
	}

	private LSUser getNoPropertyUser() {
		return new LSUser.Builder(1)
			.build();
	}

	private LSUser getPropertyUser() {
		return new LSUser.Builder(1)
			.property("이름", "이승")
			.property("직급", "팀원")
			.build();
	}

	private LSUser getDifPropertyUser() {
		return new LSUser.Builder(1)
			.property("이름", "팀원")
			.property("직급", "이승")
			.build();
	}
}
