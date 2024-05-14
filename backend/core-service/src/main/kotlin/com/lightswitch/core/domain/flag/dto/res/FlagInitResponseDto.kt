package com.lightswitch.core.domain.flag.dto.res

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.VariationDto

data class FlagInitResponseDto(
    val flagId: Long?,
    val title: String,
    val description: String,
    val type: FlagType,
    val keywords: List<KeywordDto>,
    val defaultValue: String?,
    val defaultPortion: Int?,
    val defaultDescription: String?,
    val variations: List<VariationDto>?,
    val maintainerId: Long?,
    val createdAt: String,
    val updatedAt: String,
    val deleteAt: String?,
    val active: Boolean
)