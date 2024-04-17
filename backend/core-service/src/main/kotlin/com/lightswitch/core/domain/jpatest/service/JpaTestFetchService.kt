package com.lightswitch.core.domain.jpatest.service

import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import com.lightswitch.core.domain.jpatest.repository.JpaTestFetchRepository
import org.springframework.stereotype.Service

@Service
class JpaTestFetchService (
    private val jpaTestFetchRepository: JpaTestFetchRepository
) {

    fun addJpaTestFetch(jpaTestFetch: JpaTestFetch) {
        jpaTestFetchRepository.save(jpaTestFetch)
    }
}