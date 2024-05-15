package com.lightswitch.core.domain.history.repository

import com.lightswitch.core.domain.history.repository.entity.History
import com.lightswitch.core.domain.history.repository.querydsl.HistoryCustomRepository
import org.springframework.data.jpa.repository.JpaRepository

interface HistoryRepository : JpaRepository<History, Long>, HistoryCustomRepository {
}