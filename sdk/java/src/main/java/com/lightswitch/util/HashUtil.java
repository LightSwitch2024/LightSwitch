package com.lightswitch.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class HashUtil {

	public static double getHashedPercentageForObjectIds(List<String> objectIds, int iterations) throws NoSuchAlgorithmException {
		String toHash = String.join(",", objectIds);
		toHash = String.valueOf(toHash).repeat(Math.max(0, iterations));

		MessageDigest md = MessageDigest.getInstance("MD5");
		byte[] hashedBytes = md.digest(toHash.getBytes(StandardCharsets.UTF_8));
		BigInteger no = new BigInteger(1, hashedBytes);

		double value = (no.mod(BigInteger.valueOf(9999)).doubleValue() / 9998) * 100;

		if (value == 100) {
			return getHashedPercentageForObjectIds(objectIds, iterations + 1);
		}

		return value;
	}

	public static void main(String[] args) throws NoSuchAlgorithmException {
		System.out.println(getHashedPercentageForObjectIds(List.of( "123"), 1));
		System.out.println(getHashedPercentageForObjectIds(List.of( "121"), 1));
	}
}
