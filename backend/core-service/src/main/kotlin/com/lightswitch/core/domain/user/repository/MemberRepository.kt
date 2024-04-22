package com.lightswitch.core.domain.user.repository

import com.lightswitch.core.domain.user.entity.Member
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository: JpaRepository<Member, Long> {

    fun findByEmail(email: String): Member
}