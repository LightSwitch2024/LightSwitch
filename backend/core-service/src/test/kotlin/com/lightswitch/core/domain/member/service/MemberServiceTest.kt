package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.mail.service.MailService
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class MemberServiceTest(
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
    private val signupCode: String,
) {
    @BeforeEach
    fun setUp() {
        memberService.deleteAll()
    }

    @Test
    fun addAndFind() {
        val firstName: String = "동훈"
        val lastName: String = "김"
        val telNumber: String = "01012345678"
        val email: String = "test@gmail.com"
        val password: String = "1234"
        val member: Member = Member(
            firstName = firstName,
            lastName = lastName,
            telNumber = telNumber,
            email = email,
            password = passwordService.encode(password)
        )
        memberRepository.save(member)

        val findMember: Member? = memberRepository.findByEmail("test@gmail.com")
        assertThat(findMember).isNotNull

        assertThat(member.memberId).isEqualTo(findMember!!.memberId)
        assertThat(member.email).isEqualTo(findMember.email)
        assertThat(passwordService.matches("1234", member.password)).isTrue()
        assertThat(passwordService.matches("1234", findMember.password)).isTrue()
    }

    @Test
    fun duplicateSignUp() {
        val firstName: String = "동훈"
        val lastName: String = "김"
        val telNumber: String = "01012345678"
        val email: String = "test@gmail.com"
        val password: String = "1234"
        val member: Member = Member(
            firstName = firstName,
            lastName = lastName,
            telNumber = telNumber,
            email = email,
            password = passwordService.encode(password)
        )

        memberRepository.save(member)
        assertThatExceptionOfType(MemberException::class.java).isThrownBy {
            memberService.signUp(
                SignupReqDto(
                    firstName = firstName,
                    lastName = lastName,
                    telNumber = telNumber,
                    email = email,
                    password = password,
                    authCode = "1234"
                )
            )
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
        val memberResDto = memberService.signUp(
            SignupReqDto(
                firstName = "동훈",
                lastName = "김",
                telNumber = "01012345678",
                email = email,
                password = "1234",
                authCode = redisValue!!
            )
        )

        val findMember: Member? = memberRepository.findByEmail(email)
        assertThat(findMember).isNotNull

        assertThat(memberResDto.memberId).isEqualTo(findMember!!.memberId)
        assertThat(memberResDto.email).isEqualTo(findMember.email)
        assertThat(passwordService.matches("1234", memberResDto.password)).isTrue()
    }

    @Test
    fun validateHangle() {
        assertThat(memberService.validateHangle("김동훈")).isTrue()
        assertThat(memberService.validateHangle("김동훈1")).isFalse()
        assertThat(memberService.validateHangle("김동훈!")).isFalse()
        assertThat(memberService.validateHangle("김동훈 ")).isFalse()
    }

    @Test
    fun validatePhoneNumber() {
        assertThat(memberService.validatePhoneNumber("01012345678")).isTrue()
        assertThat(memberService.validatePhoneNumber("0101234567")).isTrue()
        assertThat(memberService.validatePhoneNumber("010123456789")).isFalse()
        assertThat(memberService.validatePhoneNumber("0101234567a")).isFalse()
    }

    @Test
    fun validateEmail() {
        assertThat(memberService.validateEmail("abc@gmail.com")).isTrue()
        assertThat(memberService.validateEmail("abc@gmail")).isFalse()
        assertThat(memberService.validateEmail("abc@gmail.")).isFalse()
        assertThat(memberService.validateEmail("abc@gmail.1")).isFalse()
    }

    @Test
    fun validatePassword() {
        assertThat(memberService.validatePassword("abc1234!")).isTrue()
        assertThat(memberService.validatePassword("abc1234")).isFalse()
        assertThat(memberService.validatePassword("abc1234!abc1234!")).isFalse()
        assertThat(memberService.validatePassword("abc1234!@")).isTrue()
        assertThat(memberService.validatePassword("abcbabcb")).isFalse()
    }

    @Test
    fun `로그인 테스트`() {
//        //given
//        //유저저장
//        val signUp = memberService.signUp()
//
//        //when
//        val logIn = memberService.logIn()
//
//        //then
////        assertThat
    }

    @Test
    fun modifyUserdata() {
    }

    @Test
    fun modifyPassword() {
    }
}