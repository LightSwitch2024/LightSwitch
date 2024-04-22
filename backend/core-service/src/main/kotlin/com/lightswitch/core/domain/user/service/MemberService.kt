package com.lightswitch.core.domain.user.service

import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.user.dto.req.SignupReqDto
import com.lightswitch.core.domain.user.entity.Member
import com.lightswitch.core.domain.user.repository.MemberRepository
import org.springframework.stereotype.Service

@Service
class MemberService (
    private val memberRepository: MemberRepository,
    private val passwordService: PasswordService
) {

    fun signUp(signupReqDto: SignupReqDto): Member {

        val encodedPassword = passwordService.encode(signupReqDto.password)

        val member: Member = Member(
            email = signupReqDto.email,
            password = encodedPassword
        )

        return memberRepository.save(member)
    }
}