package com.lightswitch.core.domain.jpatest.repository.querydsl.impl

import com.lightswitch.core.domain.jpatest.entity.JpaTest
import com.lightswitch.core.domain.jpatest.entity.QJpaTest
import com.lightswitch.core.domain.jpatest.repository.querydsl.JpaTestRepositoryCustom
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.stereotype.Service

@Service
class JpaTestRepositoryCustomImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : JpaTestRepositoryCustom {
    override fun findByName(name: String): List<JpaTest> {
        val jpaTest = QJpaTest.jpaTest

        return jpaQueryFactory.selectFrom(jpaTest)
            .where(jpaTest.name.eq(name))
            .fetch()
    }

}