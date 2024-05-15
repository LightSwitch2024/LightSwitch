package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Variation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VariationRepository : JpaRepository<Variation, Long> {
    //    fun findByFlagAndDefaultFlag(flag: Flag, defaultFlag: Boolean): Variation?
    fun findByFlagAndDeletedAtIsNull(flag: Flag): List<Variation>
    fun findByFlagFlagId(flagId: Long): List<Variation>

    fun findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag: Flag): Variation
    fun findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag: Flag): List<Variation>

    fun deleteByFlagFlagId(flagId: Long)
    fun deleteByFlagFlagIdAndDefaultFlagIsFalse(flagId: Long)
}