package com.lightswitch.core.domain.history.repository

import com.lightswitch.core.domain.history.repository.entity.History
import org.springframework.data.jpa.repository.JpaRepository

interface HistoryRepository: JpaRepository<History, Long> {
}