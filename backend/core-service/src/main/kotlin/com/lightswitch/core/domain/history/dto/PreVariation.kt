package com.lightswitch.core.domain.history.dto

import com.lightswitch.core.domain.flag.repository.entity.Variation

data class PreVariation(
    val variationId: Long?,
    val value: String,
    val portion: Int,
    val defaultFlag: Boolean,
) {
    constructor(variation: Variation) : this(
        variationId = variation.variationId,
        value = variation.value,
        portion = variation.portion,
        defaultFlag = variation.defaultFlag
    )
}
