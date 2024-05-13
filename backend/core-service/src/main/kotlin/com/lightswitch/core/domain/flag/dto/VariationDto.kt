package com.lightswitch.core.domain.flag.dto

data class VariationDto(
    val variationId: Long? = null,
    val value: String,
    val portion: Int,
    val description: String,
)