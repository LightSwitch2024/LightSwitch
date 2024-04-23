package com.lightswitch.core.flag.dto.req

import com.lightswitch.core.flag.common.enum.FlagType

data class FlagRequestDto(
    val title: String,
    val tags: List<TagRequestDto>,
    val description: String,
    val type: FlagType,
    val defaultValue: String,
    val defaultValuePortion: Int,
    val variation: String,
    val variationPortion: Int,

    val userId: Long,
)