package com.lightswitch.core

import com.lightswitch.core.domain.test.entity.QTests
import com.lightswitch.core.domain.test.entity.Tests
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
class CoreServiceApplicationTests @Autowired constructor(
    @PersistenceContext
    private val entityManager: EntityManager
) {

    @Test
    @Transactional
    fun contextLoads() {
        val test = Tests()
        entityManager.persist(test)

        val queryFactory = JPAQueryFactory(entityManager)
        val qTest = QTests("test")

        val result = queryFactory.selectFrom(qTest).fetchOne()

        assertThat(result).isEqualTo(test)
        assertThat(result?.id).isEqualTo(test.id)
    }
}
