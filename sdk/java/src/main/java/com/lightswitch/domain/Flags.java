package com.lightswitch.domain;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

	public static Optional<Flag> getFlag(String flagKey) {
		return Optional.ofNullable(flags.get(flagKey));
	}

	/**
	 * add & update
	 */
	public static void addFlag(Flag flag) {

		flags.put(flag.getTitle(), flag);
	}
}
