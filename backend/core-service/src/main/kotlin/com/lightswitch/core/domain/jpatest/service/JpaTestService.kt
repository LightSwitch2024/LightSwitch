package com.lightswitch.core.domain.jpatest.service

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.repository.JpaTestRepository
import org.springframework.stereotype.Service

@Service
class JpaTestService(
    private val jpaTestRepository: JpaTestRepository
) {

    fun addJpaTest(jpaTest: JpaTest): JpaTest {
        return jpaTestRepository.save(jpaTest)
    }

    fun findByName(name: String): List<JpaTest> {
        return jpaTestRepository.findByName(name)
    }

    fun deleteAll() {
        jpaTestRepository.deleteAll()
    }

}