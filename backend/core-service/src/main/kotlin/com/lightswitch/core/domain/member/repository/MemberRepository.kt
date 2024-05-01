package com.lightswitch.core.domain.member.repository

import com.lightswitch.core.domain.member.entity.Member
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository: JpaRepository<Member, Long> {
    fun findByEmail(email: String): Member?
}