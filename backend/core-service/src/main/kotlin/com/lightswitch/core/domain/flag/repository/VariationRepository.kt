package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Variation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VariationRepository : JpaRepository<Variation, Long> {
    fun findByFlagAndDefaultFlag(flag: Flag, defaultFlag: Boolean): Variation?
}