package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Flag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FlagRepository : JpaRepository<Flag, Long> {
    fun findByDeletedAtIsNull(): List<Flag>

    fun findByMaintainerMemberIdAndDeletedAtIsNull(maintainerId: Long): List<Flag>

    fun findByTitleContainingAndDeletedAtIsNull(title: String): List<Flag>

    fun existsByTitleAndDeletedAtIsNull(title: String): Boolean

    @Query("SELECT f FROM flag f JOIN FETCH f.keywords k WHERE k.deletedAt IS NULL AND f.flagId = :flagId")
    fun findFlagWithActiveKeywords(flagId: Long): Flag?

    @Query("SELECT f FROM flag f WHERE EXISTS (SELECT k FROM f.keywords k WHERE k.deletedAt IS NULL) AND f.flagId = :flagId")
    fun findFlagsWithNoDeletedKeywords(flagId: Long): Flag?

}
