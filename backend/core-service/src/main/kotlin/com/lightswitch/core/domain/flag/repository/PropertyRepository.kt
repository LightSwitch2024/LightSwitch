package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Property
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PropertyRepository : JpaRepository<Property, Long> {

    fun findByKeywordKeywordId(keywordId: Long): List<Property>
}