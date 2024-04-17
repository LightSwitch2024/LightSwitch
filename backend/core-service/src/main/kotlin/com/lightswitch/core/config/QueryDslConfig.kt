package com.lightswitch.core.config

import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext

@Configuration
class QuerydslConfig (
        @PersistenceContext
        private val entityManager: EntityManager
) {
    @Bean fun jpaQueryFactory(): JPAQueryFactory = JPAQueryFactory(entityManager)
}