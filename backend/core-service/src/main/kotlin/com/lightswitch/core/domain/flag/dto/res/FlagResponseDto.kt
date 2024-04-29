package com.lightswitch.core.domain.flag.dto.res

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.VariationDto

data class FlagResponseDto(
    val flagId: Long,
    val title: String,
    val tags: List<TagResponseDto>,
    val description: String,
    val type: FlagType,
    val defaultValue: String,
    val defaultValuePortion: Int,
    val defaultValueDescription: String,
    val variations: List<VariationDto>,
    val userId: Long,

    val createdAt: String,
    val updatedAt: String,
    val active: Boolean,
)