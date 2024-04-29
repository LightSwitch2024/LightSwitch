package com.lightswitch.core.domain.flag.dto.res

import com.lightswitch.core.domain.flag.common.enum.FlagType

data class FlagInitResponseDto(
    val flagId: Long,
    val title: String,
    val description: String,
    val type: FlagType,
    val defaultValue: String,
    val defaultValuePortion: Int,
    val defaultValueDescription: String,
    val variations: List<VariationResponseDto>,
    val maintainerId: Long,
    val createdAt: String,
    val updatedAt: String,
    val deleteAt: String?,
    val active: Boolean,
) {
    data class VariationResponseDto(
        val value: String,
        val portion: Int,
        val description: String,
    )
}

