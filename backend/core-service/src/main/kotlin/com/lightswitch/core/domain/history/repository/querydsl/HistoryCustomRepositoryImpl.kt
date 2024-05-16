package com.lightswitch.core.domain.history.repository.querydsl

import com.lightswitch.core.domain.flag.repository.entity.QFlag.flag
import com.lightswitch.core.domain.history.dto.HistoryResponse
import com.lightswitch.core.domain.history.repository.entity.QHistory.history
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.persistence.EntityManager

class HistoryCustomRepositoryImpl(
    private val entityManager: EntityManager
) : HistoryCustomRepository {

    private val queryFactory: JPAQueryFactory = JPAQueryFactory(entityManager)

    override fun findByFlagFlagId(flagId: Long): List<HistoryResponse> {
        return queryFactory.select(
            Projections.constructor(
                HistoryResponse::class.java,
                flag.title,
                history.target,
                history.previous,
                history.current,
                history.action,
                history.createdAt
            )
        )
            .from(history)
            .join(history.flag, flag)
            .where(history.flag.flagId.eq(flagId))
            .orderBy(history.createdAt.desc())
            .fetch()
    }

    override fun findAllByLimit(limit: Long): List<HistoryResponse> {
        return queryFactory.select(
            Projections.constructor(
                HistoryResponse::class.java,
                flag.title,
                history.target,
                history.previous,
                history.current,
                history.action,
                history.createdAt
            )
        )
            .from(history)
            .join(history.flag, flag)
            .orderBy(history.createdAt.desc())
            .limit(limit)
            .fetch()

    }
}