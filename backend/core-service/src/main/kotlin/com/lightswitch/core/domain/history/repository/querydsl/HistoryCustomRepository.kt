package com.lightswitch.core.domain.history.repository.querydsl

import com.lightswitch.core.domain.history.dto.HistoryResponse

interface HistoryCustomRepository {

    fun findByFlagFlagId(flagId: Long): List<HistoryResponse>

    fun findAllByLimit(limit: Long): List<HistoryResponse>
}