package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Keyword
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface KeywordRepository : JpaRepository<Keyword, Long> {
    fun findByFlagFlagId(flagId: Long): List<Keyword>

    fun deleteByFlagFlagId(flagId: Long)
}