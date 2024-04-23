package com.lightswitch.core.domain.test.repository

import com.lightswitch.core.domain.test.entity.Tests
import org.springframework.data.jpa.repository.JpaRepository

interface TestRepository : JpaRepository<Tests?, Long?>