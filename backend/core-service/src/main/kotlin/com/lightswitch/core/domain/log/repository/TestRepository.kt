package com.lightswitch.core.domain.log.repository

import com.lightswitch.core.domain.log.entity.Tests
import org.springframework.data.jpa.repository.JpaRepository

interface TestRepository : JpaRepository<Tests?, Long?>