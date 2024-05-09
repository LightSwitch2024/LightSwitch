package com.lightswitch.core.domain.flag.dto

data class KeywordDto(
    val properties: List<PropertyDto>,
    val description: String,
    val value: String
)