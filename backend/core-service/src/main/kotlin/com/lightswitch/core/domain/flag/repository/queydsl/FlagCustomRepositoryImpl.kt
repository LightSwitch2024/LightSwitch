package com.lightswitch.core.domain.flag.repository.queydsl

import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.QFlag
import com.lightswitch.core.domain.flag.repository.entity.QTag
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.persistence.EntityManager
import org.springframework.stereotype.Repository

@Repository
class FlagCustomRepositoryImpl(
    private val entityManager: EntityManager,
) : FlagCustomRepository {

    private val jpaQueryFactory: JPAQueryFactory = JPAQueryFactory(entityManager)
    private val qFlag = QFlag.flag
    private val qTag = QTag.tag
    override fun findByTagContents(tagContents: List<String>): List<Flag> {
        /*return jpaQueryFactory.selectFrom(qFlag)
            .innerJoin(qFlag.tags, qTag)
            .where(qTag.content.`in`(tagContents))
            .fetch()*/
        val subQuery = JPAExpressions
            .select(qFlag)
            .from(qFlag)
            .innerJoin(qFlag.tags, qTag)
            .where(qTag.content.`in`(tagContents))
            .groupBy(qFlag)
            .having(qTag.content.count().eq(tagContents.size.toLong()))

        return jpaQueryFactory.selectFrom(qFlag)
            .where(qFlag.`in`(subQuery))
            .fetch()
    }
}