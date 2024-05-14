package com.lightswitch.core.domain.organization.repository

import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.organization.repository.entity.Organization
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OrganizationRepository : JpaRepository<Organization, Long> {

    fun findByNameAndDeletedAtIsNull(name: String): Organization?
}