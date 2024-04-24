package com.lightswitch.core.domain.flag.dto.res

data class FlagSummaryDto(
    val flagId: Long,
    val title: String,
    val description: String,
    val tags: List<TagResponseDto>,
    val active: Boolean,
    val maintainerName: String,
)