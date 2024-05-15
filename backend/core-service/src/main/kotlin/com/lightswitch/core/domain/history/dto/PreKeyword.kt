package com.lightswitch.core.domain.history.dto

import com.lightswitch.core.domain.flag.repository.entity.Keyword

data class PreKeyword(
    val keywordId: Long? = null,
    val properties: List<PreProperty>,
    val value: String,
) {
    constructor(keyword: Keyword) : this(
        keywordId = keyword.keywordId,
        properties = keyword.properties.map { it.toPrevious() },
        value = keyword.value
    )
}
