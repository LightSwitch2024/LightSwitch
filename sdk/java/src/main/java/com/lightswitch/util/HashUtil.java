package com.lightswitch.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

public class HashUtil {

	public static double getHashedPercentage(List<String> objectIds, int iterations) {
		String contextId = String.join(",", objectIds);
		contextId = String.valueOf(contextId).repeat(Math.max(0, iterations));
		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance("MD5");
			byte[] hashedBytes = md.digest(contextId.getBytes(StandardCharsets.UTF_8));
			BigInteger no = new BigInteger(1, hashedBytes);
			double value = (no.mod(BigInteger.valueOf(9999)).doubleValue() / 9998) * 100;
			if (value == 100) {
				return getHashedPercentage(objectIds, iterations + 1);
			}
			return value;
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}
}
