package com.lightswitch.core.domain.flag.repository

import jakarta.validation.constraints.Pattern.Flag
import org.springframework.data.jpa.repository.JpaRepository

interface FlagRepository : JpaRepository<Flag, Long>