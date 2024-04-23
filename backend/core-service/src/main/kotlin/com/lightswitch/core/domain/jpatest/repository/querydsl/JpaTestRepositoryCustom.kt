package com.lightswitch.core.domain.jpatest.repository.querydsl

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import org.springframework.stereotype.Repository

@Repository
interface JpaTestRepositoryCustom {
    fun findByName(name: String): List<JpaTest>

    fun findByIdAndName(id: Long, name: String): List<JpaTest>

    fun deleteAll()

    fun saveAll(jpaTests: List<JpaTest>)
}