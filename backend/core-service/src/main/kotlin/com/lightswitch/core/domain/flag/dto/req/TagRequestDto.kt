package com.lightswitch.core.domain.flag.dto.req

data class TagRequestDto(
    val tagId: Long?,
    val colorHex: String,
    val content: String
)