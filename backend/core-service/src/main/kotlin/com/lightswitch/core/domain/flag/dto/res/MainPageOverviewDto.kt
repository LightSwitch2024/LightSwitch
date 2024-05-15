package com.lightswitch.core.domain.flag.dto.res

import com.lightswitch.core.domain.history.dto.HistoryResponse

data class MainPageOverviewDto(
    val totalFlags: Int,
    val activeFlags: Int,
    val sdkKey: String,
    val histories: List<HistoryResponse>? = mutableListOf()
)