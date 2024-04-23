package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Variation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VariationRepository : JpaRepository<Variation, Long>