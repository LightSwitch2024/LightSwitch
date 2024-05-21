package com.lightswitch.core.domain.jpatest.service

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.entity.JpaTestFetch
import com.lightswitch.core.domain.jpatest.repository.JpaTestFetchRepository
import com.lightswitch.core.domain.jpatest.repository.JpaTestRepository
import jakarta.transaction.Transactional
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@org.springframework.transaction.annotation.Transactional
@SpringBootTest
class JpaTestServiceTest(
    @Autowired
    private val jpaTestService: JpaTestService,

    @Autowired
    private val jpaTestFetchService: JpaTestFetchService,

    @Autowired
    private val jpaTestRepository: JpaTestRepository,

    @Autowired
    private val jpaTestFetchRepository: JpaTestFetchRepository

) {
    @BeforeEach
    fun setUp() {
        jpaTestRepository.deleteAll()
        jpaTestFetchRepository.deleteAll()

        println("============ Before Fetch ==================")
    }

    @Test
    @DisplayName("JpaTest 추가 테스트")
    fun addJpaTest() {
        val jpaTestFetch = JpaTestFetch(name = "testFetch")
        jpaTestFetchRepository.save(jpaTestFetch)
        jpaTestFetchService.findByName("testFetch").stream().findFirst().get()
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
        val jpaTestFetch = JpaTestFetch(name = "testFetch2222")
        val savedJpaTestFetch = jpaTestFetchRepository.save(jpaTestFetch)

        val jpaTest: JpaTest = JpaTest(name = "test", jpaTestFetch = savedJpaTestFetch)
        jpaTestRepository.save(jpaTest)

        val findJpaTest: JpaTest = jpaTestRepository.findByName("test").first()
        println("============ Before Fetch ==================")
        val testName: String = findJpaTest.jpaTestFetch.name
        println("============ After Fetch ==================")
        print(testName)
    }
}