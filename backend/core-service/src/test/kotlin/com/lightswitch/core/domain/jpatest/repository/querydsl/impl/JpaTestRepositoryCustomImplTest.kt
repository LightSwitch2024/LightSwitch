package com.lightswitch.core.domain.jpatest.repository.querydsl.impl

import com.lightswitch.core.domain.jpatest.repository.querydsl.JpaTestRepositoryCustom
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class JpaTestRepositoryCustomImplTest (
    @Autowired private val jpaTestRepositoryCustom: JpaTestRepositoryCustom
) {

    @Test
    @DisplayName("findByName 테스트")
    fun findByName() {
        val result = jpaTestRepositoryCustom.findByName("test")
        assertEquals(5, result.size)
    }

    @Test
    @DisplayName("findByIdAndName 테스트")
    fun findByIdAndName() {
        val result = jpaTestRepositoryCustom.findByIdAndName(1L, "test")
        assertEquals(1, result.size)
    }
}