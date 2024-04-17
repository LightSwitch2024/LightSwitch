package com.lightswitch.core.domain.jpatest.repository

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import org.springframework.data.jpa.repository.JpaRepository

interface JpaTestRepository : JpaRepository<JpaTest, Long> {

    fun findByName(name: String): List<JpaTest>
}