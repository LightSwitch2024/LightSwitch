package com.lightswitch.core.domain.flag.dto.req

class FlagInfoRequestDto(
    val title: String,
    val description: String,
    val tags: List<TagRequestDto>,
)