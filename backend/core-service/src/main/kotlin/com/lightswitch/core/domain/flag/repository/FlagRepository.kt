package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Flag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface FlagRepository : JpaRepository<Flag, Long> {
    fun findByDeletedAtIsNull(): List<Flag>

    fun findByDeletedAtIsNullOrderByCreatedAt(): List<Flag>

    fun findByMaintainerMemberIdAndDeletedAtIsNull(maintainerId: Long): List<Flag>

    fun findByTitleContainingAndDeletedAtIsNull(title: String): List<Flag>

    fun existsByTitleAndDeletedAtIsNull(title: String): Boolean

//    @Query("SELECT f FROM flag f JOIN FETCH f.keywords k WHERE k.deletedAt IS NULL AND f.flagId = :flagId")
//    fun findFlagWithActiveKeywords(flagId: Long): Flag?

//    @Query("SELECT f FROM flag f WHERE EXISTS (SELECT k FROM f.keywords k WHERE k.deletedAt IS NULL) AND f.flagId = :flagId")
//    fun findFlagsWithNoDeletedKeywords(@Param("flagId") flagId: Long): Flag?

    @Query(
        "SELECT f FROM flag f WHERE f.flagId = :flagId AND " +
                "(EXISTS (SELECT k FROM f.keywords k WHERE k.flag = f AND k.deletedAt IS NULL) OR " +
                "NOT EXISTS (SELECT k FROM f.keywords k WHERE k.flag = f))"
    )
    fun findFlagsWithNoDeletedKeywords(@Param("flagId") flagId: Long): Flag?

}
