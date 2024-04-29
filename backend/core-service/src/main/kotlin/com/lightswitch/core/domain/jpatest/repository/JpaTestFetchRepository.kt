package com.lightswitch.core.domain.jpatest.repository

import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JpaTestFetchRepository : JpaRepository<JpaTestFetch, Long> {
    fun findByName(name: String): List<JpaTestFetch>
}