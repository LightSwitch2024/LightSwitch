package com.lightswitch.core.domain.flag.dto.req

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.VariationDto

data class FlagRequestDto(
    val title: String,
    val tags: List<TagRequestDto>,
    val description: String,
    val type: FlagType,
    val keywords: List<KeywordDto>,
    val defaultValue: String,
    val defaultPortion: Int,
    val defaultDescription: String,
    val variations: List<VariationDto>,
    val memberId: Long,
)