package com.lightswitch.core.domain.flag.dto

data class PropertyDto(
    val propertyId: Long? = null,
    val property: String,
    val data: String
)