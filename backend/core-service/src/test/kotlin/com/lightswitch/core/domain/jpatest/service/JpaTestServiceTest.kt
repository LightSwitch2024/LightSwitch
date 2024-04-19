package com.lightswitch.core.domain.jpatest.service

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import com.lightswitch.core.domain.jpatest.repository.JpaTestRepository
import jakarta.transaction.Transactional
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class JpaTestServiceTest (
    @Autowired private var jpaTestService: JpaTestService,
    @Autowired private var jpaTestFetchService: JpaTestFetchService,
    @Autowired private var jpaTestRepository: JpaTestRepository
) {
//    @BeforeEach
    fun setUp() {
        jpaTestService.deleteAll()
        jpaTestFetchService.deleteAll()
    }

    @Test
    @DisplayName("JpaTest 추가 테스트")
    fun addJpaTest() {
        val jpaTestFetch = jpaTestFetchService.findByName("testFetch").stream().findFirst().get()
        val jpaTest = JpaTest(name = "test", jpaTestFetch = jpaTestFetch)
        val result = jpaTestService.addJpaTest(jpaTest)
        assertThat(result.name).isEqualTo(jpaTest.name)

        val findByName = jpaTestService.findByName("test").stream().findFirst().get()
        assertThat(findByName.name).isEqualTo(jpaTest.name)
    }

    @Test
    @DisplayName("JpaTestFetch 추가 테스트")
    fun addJpaTestFetch() {
        val jpaTestFetch = JpaTestFetch(name = "testFetch")
        val result = jpaTestFetchService.addJpaTestFetch(jpaTestFetch)
        assertThat(result.name).isEqualTo(jpaTestFetch.name)

        val jpaTestFetch2 = JpaTestFetch(name = "testFetch2")
        val result2 = jpaTestFetchService.addJpaTestFetch(jpaTestFetch2)
        assertThat(result2.name).isEqualTo(jpaTestFetch2.name)
    }

    @Transactional
    @Test
    @DisplayName("fetch lazy 테스트")
    fun addFetchLazy() {
        val jpaTest = jpaTestRepository.findById(1L).get()
        println("============ Before Fetch ==================")
        val testName = jpaTest.jpaTestFetch.name
        println("============ After Fetch ==================")
        print(testName)
    }
}