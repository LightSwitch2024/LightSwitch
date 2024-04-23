package com.lightswitch.core.domain.jpatest.repository.querydsl.impl

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import com.lightswitch.core.domain.jpatest.repository.querydsl.JpaTestRepositoryCustom
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class JpaTestRepositoryCustomImplTest (
    @Autowired private val jpaTestRepositoryCustom: JpaTestRepositoryCustom
) {

    @BeforeEach
    fun setUp() {
        jpaTestRepositoryCustom.deleteAll()
        jpaTestRepositoryCustom.saveAll(
            (1..5).map { i -> JpaTest(name = "test", jpaTestFetch = JpaTestFetch(name = "testFetch")) }
        )
    }

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