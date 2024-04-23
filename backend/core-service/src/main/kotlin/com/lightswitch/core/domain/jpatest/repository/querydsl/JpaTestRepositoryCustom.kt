package com.lightswitch.core.domain.jpatest.repository.querydsl

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import org.springframework.stereotype.Repository

@Repository
interface JpaTestRepositoryCustom {
    fun findByName(name: String): List<JpaTest>

}