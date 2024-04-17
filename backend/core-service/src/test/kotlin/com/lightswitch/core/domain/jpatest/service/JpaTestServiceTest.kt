package com.lightswitch.core.domain.jpatest.service

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import org.assertj.core.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class JpaTestServiceTest (
    @Autowired private val jpaTestService: JpaTestService,
    @Autowired private val jpaTestFetchService: JpaTestFetchService
) {
    @BeforeEach
    fun setUp() {
        jpaTestService.deleteAll()
    }

    @Test
    @DisplayName("추가 테스트")
    fun addJpaTest() {
        val jpaTest = JpaTest(name = "test", jpaTestFetch = JpaTestFetch(name = "testFetch"))
        val result = jpaTestService.addJpaTest(jpaTest)
        assertThat(result.name).isEqualTo(jpaTest.name)

        val findByName = jpaTestService.findByName("test").stream().findFirst().get()
        assertThat(findByName.name).isEqualTo(jpaTest.name)
    }

    @Test
    @DisplayName("fetch lazy 테스트")
    fun addJpaTestFetch() {
        val jpaTestFetch: JpaTestFetch = JpaTestFetch(name = "testFetch")
        jpaTestFetchService.addJpaTestFetch(jpaTestFetch)
        val jpaTest: JpaTest = JpaTest(name = "test", jpaTestFetch = jpaTestFetch)
        jpaTestService.addJpaTest(jpaTest)

        val findByName = jpaTestService.findByName("test").stream().findFirst().get()

    }
}