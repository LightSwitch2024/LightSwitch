package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.mail.service.MailService
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.assertj.core.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class MemberServiceTest (
    @Autowired
    private val memberService: MemberService,
    @Autowired
    private val memberRepository: MemberRepository,
    @Autowired
    private val passwordService: PasswordService,
    @Autowired
    private val mailService: MailService,
    @Autowired
    private val redisService: RedisService,
    @Value("\${spring.data.redis.code.signup}")
    private val signupCode: String
) {
    @BeforeEach
    fun setUp() {
        memberRepository.deleteAll()
    }

    @Test
    fun addAndFind() {
        val email: String = "test@gmail.com"
        val password: String = "1234"
        val member: Member = Member(email = email, password = passwordService.encode(password))
        memberRepository.save(member)

        val findMember:Member? = memberRepository.findByEmail("test@gmail.com")
        assertThat(findMember).isNotNull

        assertThat(member.memberId).isEqualTo(findMember!!.memberId)
        assertThat(member.email).isEqualTo(findMember.email)
        assertThat(passwordService.matches("1234", member.password)).isTrue()
        assertThat(passwordService.matches("1234", findMember.password)).isTrue()
    }

    @Test
    fun duplicateSignUp() {
        val email: String = "test@gmail.com"
        val password: String = "1234"
        val member: Member = Member(email = email, password = passwordService.encode(password))

        memberRepository.save(member)
        assertThatExceptionOfType(MemberException::class.java).isThrownBy {
            memberRepository.save(member)
        }
    }

    @Test
    fun saveRedis() {
        val email: String = "huni19541@gmail.com"
        mailService.sendMail(email)

        val redisValue: String? = redisService.find("$signupCode:$email")
        assertThat(redisValue).isNotNull
        println(redisValue)
    }

    @Test
    fun signup() {
        val email: String = "huni19541@gmail.com"
        mailService.sendMail(email)

        val redisValue: String? = redisService.find("$signupCode:$email")
        assertThat(redisValue).isNotNull
        val member: Member = memberService.signUp(email, "1234", redisValue!!)

        val findMember: Member? = memberRepository.findByEmail(email)
        assertThat(findMember).isNotNull

        assertThat(member.memberId).isEqualTo(findMember!!.memberId)
        assertThat(member.email).isEqualTo(findMember.email)
        assertThat(passwordService.matches("1234", member.password)).isTrue()
    }
}