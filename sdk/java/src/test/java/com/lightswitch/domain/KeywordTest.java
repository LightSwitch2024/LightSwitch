package com.lightswitch.domain;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

class KeywordTest {

	@Mock
	private Keyword keyword;

	private List<Property> properties;
	private String value;

	@BeforeEach
	void createKeyword(){
		properties = List.of(new Property("이름", "이승"), new Property("회사", "회사이름"));
		value = "true";
		keyword = new Keyword(properties, value);
	}


	@Test
	void getProperties() {
		assertThat(keyword).isNotNull();
		assertThat(keyword.getProperties().isEmpty()).isFalse();
		assertThat(properties.isEmpty()).isFalse();
		assertThat(keyword.getProperties()).isEqualTo(properties);
	}

	@Test
	void getValue() {
		assertThat(keyword).isNotNull();
		assertThat(keyword.getValue()).isEqualTo(value);
	}
}