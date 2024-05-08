package com.lightswitch.core.domain.flag.dto.req

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.VariationDto

class VariationInfoRequestDto(
    val type: FlagType,
    val defaultValue: String,
    val defaultPortion: Int,
    val defaultDescription: String,
    val variations: List<VariationDto>
)