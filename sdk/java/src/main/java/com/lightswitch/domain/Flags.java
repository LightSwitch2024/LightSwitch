package com.lightswitch.domain;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Flags {

	private static final Map<String, Flag> flags = new HashMap<>();

	private Flags() {
	}

	public static void addAllFlags(List<Flag> initFlags) {
		flags.clear();
		for (Flag initFlag : initFlags) {
			flags.put(initFlag.getTitle() , initFlag);
		}
	}

	public static Flag getFlag(String flagKey) {
		return flags.get(flagKey);
	}

	/**
	 * add & update
	 */
	public static void addFlag(Flag flag) {

		flags.put(flag.getTitle(), flag);
	}
}
