package com.lightswitch.core.flag.dto.res

import com.lightswitch.core.flag.common.enum.FlagType

data class FlagResponseDto(
    val flagId: Long,
    val title: String,
    val tags: List<TagResponseDto>,
    val description: String,
    val type: FlagType,
    val defaultValue: String,
    val defaultValuePortion: Int,
    val variation: String,
    val variationPortion: Int,

    val userId: Long,
    val createdAt: String,
    val updatedAt: String,
)