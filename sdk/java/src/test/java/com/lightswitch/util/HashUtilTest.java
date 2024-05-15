package com.lightswitch.util;

import static org.assertj.core.api.Assertions.*;

import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.junit.jupiter.api.Test;

class HashUtilTest {

	@Test
	void 결과는_0_100_사이의_값이다() {
		double result1 = HashUtil.getHashedPercentage(List.of("123","flagTitle"), 1);
		double result2 = HashUtil.getHashedPercentage(List.of("121","flagTitle"), 1);

		assertThat(result1).isBetween(0.0, 100.0);
		assertThat(result2).isBetween(0.0, 100.0);
	}

	@Test
	void 유니코드_문자열로_균등한_백분율_분포를_테스트한다() {
		Random random = new Random();
		int lowerHalf = 0;
		int upperHalf = 0;
		int totalTests = 10000;

		for (int i = 0; i < totalTests; i++) {
			String randomUnicodeString = generateRandomUnicodeString(random);
			double percentage = HashUtil.getHashedPercentage(List.of(randomUnicodeString, "flagTitle"), 1);

			if (percentage < 50.0) {
				lowerHalf++;
			} else {
				upperHalf++;
			}
		}

		assertThat(lowerHalf).isGreaterThan(4000);
		assertThat(upperHalf).isGreaterThan(4000);
	}

	private String generateRandomUnicodeString(Random random) {
		return random.ints(48, 122)
			.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
			.limit(10)
			.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
			.toString();
	}

	@Test
	void uuid로_균등한_백분율_분포를_테스트한다() {
		int lowerHalf = 0;
		int upperHalf = 0;
		int totalTests = 10000;

		for (int i = 0; i < totalTests; i++) {
			String randomUUIDString = UUID.randomUUID().toString();
			double percentage = HashUtil.getHashedPercentage(List.of(randomUUIDString, "flagTitle"), 1);

			if (percentage < 50.0) {
				lowerHalf++;
			} else {
				upperHalf++;
			}
		}

		assertThat(lowerHalf).isGreaterThan(4000);
		assertThat(upperHalf).isGreaterThan(4000);
	}

	@Test
	void 결과는_정확히_100이_나오지_않는다() {
		double result = HashUtil.getHashedPercentage(List.of("userId", "flagTitle"), 1);
		assertThat(result).isNotEqualTo(100.0);
	}

}