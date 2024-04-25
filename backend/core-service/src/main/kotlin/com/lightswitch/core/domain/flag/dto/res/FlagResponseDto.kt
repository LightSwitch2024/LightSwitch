package com.lightswitch.core.domain.flag.dto.res

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.entity.Flag

data class FlagResponseDto(
    val flagId: Long,
    val title: String,
    val tags: List<TagResponseDto>,
    val description: String,
    val type: FlagType,
    val defaultValue: String,
    val defaultValuePortion: Int,
    val defaultValueDescription: String,
    val variation: String,
    val variationPortion: Int,
    val variationDescription: String,
    val active: Boolean,

    val userId: Long,
    val createdAt: String,
    val updatedAt: String,
    val active: Boolean,
)