package com.lightswitch.core.domain.flag.dto.res

data class MainPageOverviewDto(
    val totalFlags: Int,
    val activeFlags: Int,
    val sdkKey: String
)