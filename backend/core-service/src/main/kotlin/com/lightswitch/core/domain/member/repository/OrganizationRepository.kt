package com.lightswitch.core.domain.member.repository

import com.lightswitch.core.domain.member.entity.Organization
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OrganizationRepository : JpaRepository<Organization, Long> {

    fun findByNameAndDeletedAtIsNull(orgName: String): Organization?

}