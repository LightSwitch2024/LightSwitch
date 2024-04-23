package com.lightswitch.core.domain.flag.dto.res

data class TagResponseDto(
    val tagId: Long,
    val colorHex: String,
    val content: String
)