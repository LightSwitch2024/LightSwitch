package com.lightswitch.core.domain.member.repository

import com.lightswitch.core.domain.member.entity.Member
import jakarta.persistence.Id
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository : JpaRepository<Member, Long> {
    fun findByEmailAndDeletedAtIsNull(email: String): Member?

    fun findAllAByDeletedAtIsNull(): List<Member>
}