package com.lightswitch.core.domain.flag.dto

data class KeywordDto(
    val keywordId: Long? = null,
    val properties: List<PropertyDto>,
    val description: String,
    val value: String
)