package com.lightswitch.core.domain.history.dto

import com.lightswitch.core.domain.flag.repository.entity.Property

data class PreProperty(
    val propertyId: Long? = null,
    val property: String,
    val data: String,
){
    constructor(property: Property): this(
        propertyId = property.propertyId,
        property = property.property,
        data = property.data
    )
}
