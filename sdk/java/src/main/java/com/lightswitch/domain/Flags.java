package com.lightswitch.domain;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.lightswitch.domain.dto.FlagResponse;
import com.lightswitch.domain.dto.InitResponse;

public class Flags {

	private static final Map<String, Flag> flags = new HashMap<>();

	private Flags() {
	}

	public static void addAllFlags(InitResponse initFlags) {
		flags.clear();

		List<FlagResponse> data = initFlags.getData();
		for (FlagResponse flagResponse : data) {
			flags.put(flagResponse.getTitle() , flagResponse.toFlag());
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

	public static void clear() {
		flags.clear();
	}
}
