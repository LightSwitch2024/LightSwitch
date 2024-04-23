package com.lightswitch.core.domain.flag.repository

import com.lightswitch.core.domain.flag.repository.entity.Flag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FlagRepository : JpaRepository<Flag, Long>