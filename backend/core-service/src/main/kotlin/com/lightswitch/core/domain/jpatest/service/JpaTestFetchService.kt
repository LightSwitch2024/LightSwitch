package com.lightswitch.core.domain.jpatest.service

import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import com.lightswitch.core.domain.jpatest.repository.JpaTestFetchRepository
import org.springframework.stereotype.Service

@Service
class JpaTestFetchService(
    private val jpaTestFetchRepository: JpaTestFetchRepository
) {

    fun addJpaTestFetch(jpaTestFetch: JpaTestFetch): JpaTestFetch {
        return jpaTestFetchRepository.save(jpaTestFetch)
    }

    fun findByName(name: String): List<JpaTestFetch> {
        return jpaTestFetchRepository.findByName(name)
    }

    fun deleteAll() {
        jpaTestFetchRepository.deleteAll()
    }
}