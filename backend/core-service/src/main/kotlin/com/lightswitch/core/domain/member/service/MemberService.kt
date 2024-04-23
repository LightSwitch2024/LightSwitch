package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class MemberService (
    private val memberRepository: MemberRepository,
    private val passwordService: PasswordService,
    private val redisService: RedisService,
    @Value("\${spring.data.redis.code.signup}")
    val signupCode: String
) {
    fun signUp(email: String, password: String, authCode: String): Member {

        val existsMember: Member? = memberRepository.findByEmail(email)
        existsMember?.let {
            throw MemberException("이미 가입된 이메일 입니다.")
        }

        val redisAuthCode: String = redisService.find("$signupCode:$email") ?: throw MemberException("코드 만료 시간이 지났습니다.")

        val encodedPassword = passwordService.encode(password)

        val member: Member = Member(
            email = email,
            password = encodedPassword
        )

        return memberRepository.save(member)
    }
}