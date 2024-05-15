package com.lightswitch.core.domain.flag.dto

import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Variation
import lombok.ToString

@ToString
data class VariationDto(
    val variationId: Long? = null,
    val value: String,
    val portion: Int,
    val description: String,
){

    fun toEntity(flag: Flag): Variation{
        return Variation(
            null,
            flag,
            value,
            portion,
            description,
            false
        )
    }
}