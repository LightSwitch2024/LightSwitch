package com.lightswitch.core.domain.history.dto

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.entity.Flag

data class PreFlag(
    val flagId: Long? = null,
    var title: String,
    var type: FlagType,
    val keywords: List<PreKeyword>,
    var active: Boolean = false,
) {
    constructor(flag: Flag) : this(
        flagId = flag.flagId,
        title = flag.title,
        type = flag.type,
        keywords = flag.keywords.map { it.toPrevious() },
        active = flag.active,
    )
}
