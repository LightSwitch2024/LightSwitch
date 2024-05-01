package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.FlagKeywordMapping
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FlagKeywordMappingRepository : JpaRepository<FlagKeywordMapping, Long> {
    fun findByFlagAndDeletedAtIsNull(flag: Flag): FlagKeywordMapping
}