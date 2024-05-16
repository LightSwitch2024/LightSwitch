package com.lightswitch.core.domain.domain.repository

import com.lightswitch.core.domain.domain.repository.entity.Domain
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DomainRepository : JpaRepository<Domain, Long> {
}