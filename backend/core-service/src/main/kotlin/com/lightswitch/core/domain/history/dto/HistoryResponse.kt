package com.lightswitch.core.domain.history.dto

import com.lightswitch.core.domain.history.repository.entity.HistoryType
import java.time.LocalDateTime

data class HistoryResponse(
    val flagTitle: String,
    val target: String?,
    val previous: String?,
    val current: String?,
    val action: HistoryType,
    val createdAt: LocalDateTime,
)