package com.lightswitch.core.domain.user.service

import com.lightswitch.core.domain.user.dto.req.SignupReqDto
import com.lightswitch.core.domain.user.entity.Member
import com.lightswitch.core.domain.user.repository.MemberRepository
import org.springframework.stereotype.Service

@Service
class MemberService (
    private val memberRepository: MemberRepository
) {

    fun signUp(signupReqDto: SignupReqDto): Member {
        val member: Member = Member(
            email = signupReqDto.email,
            password = signupReqDto.password
        )

        return memberRepository.save(member)
    }
}