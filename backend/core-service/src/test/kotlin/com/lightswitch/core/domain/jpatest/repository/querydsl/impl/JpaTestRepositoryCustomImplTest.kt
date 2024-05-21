package com.lightswitch.core.domain.jpatest.repository.querydsl.impl

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import com.lightswitch.core.domain.jpatest.repository.JpaTestFetchRepository
import com.lightswitch.core.domain.jpatest.repository.JpaTestRepository
import com.lightswitch.core.domain.jpatest.repository.querydsl.JpaTestRepositoryCustom
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class JpaTestRepositoryCustomImplTest(
    @Autowired
    private val jpaTestRepositoryCustom: JpaTestRepositoryCustom,

    @Autowired
    private val jpaTestFetchRepository: JpaTestFetchRepository,

    @Autowired
    private val jpaTestRepository: JpaTestRepository
) {

    @BeforeEach
    fun setUp() {
        jpaTestRepository.deleteAll()
        jpaTestFetchRepository.deleteAll()

        val jpaTestFetch = JpaTestFetch(name = "testFetch")
        val savedJpaTestFetch: JpaTestFetch = jpaTestFetchRepository.save(jpaTestFetch)
        jpaTestRepository.deleteAll()
        repeat(5) {
            val jpaTest = JpaTest(name = "test", jpaTestFetch = savedJpaTestFetch)
            jpaTestRepository.save(jpaTest)
        }
    }

    @Test
    @DisplayName("findByName 테스트")
    fun findByName() {
        val result = jpaTestRepositoryCustom.findByName("test")
        assertEquals(5, result.size)
    }

}