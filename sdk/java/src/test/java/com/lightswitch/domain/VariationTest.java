package com.lightswitch.domain;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

class VariationTest {

	@Mock
	private Variation variation;

	private String value;
	private int portion;
	private String description;

	@BeforeEach
	void createVariation(){
		portion = 30;
		value = "true";
		description = "설명";
		variation = new Variation(0, value, portion, description);
	}

	@Test
	void getPortion() {
		assertThat(variation).isNotNull();
		assertThat(variation.getPortion()).isLessThanOrEqualTo (100);
		assertThat(variation.getPortion()).isGreaterThanOrEqualTo(0);
		assertThat(variation.getPortion()).isEqualTo(portion);
	}

	@Test
	void getValue() {
		assertThat(variation).isNotNull();
		assertThat(variation.getValue()).isEqualTo(value);
	}
}