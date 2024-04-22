package com.lightswitch.core.domain.user.service

import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.user.dto.req.SignupReqDto
import com.lightswitch.core.domain.user.entity.Member
import com.lightswitch.core.domain.user.repository.MemberRepository
import org.assertj.core.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class MemberServiceTest (
    @Autowired
    private val memberService: MemberService,
    @Autowired
    private val memberRepository: MemberRepository,
    @Autowired
    private val passwordService: PasswordService
) {
    @BeforeEach
    fun setUp() {
        memberRepository.deleteAll()
    }

    @Test
    fun addAndFind() {
        val signupReqDto: SignupReqDto = SignupReqDto("test@gmail.com", "1234", "1234")
        val member: Member = memberService.signUp(signupReqDto)

        val findMember:Member = memberRepository.findByEmail("test@gmail.com")

        assertThat(member.memberId).isEqualTo(findMember.memberId)
        assertThat(member.email).isEqualTo(findMember.email)
        assertThat(passwordService.matches("1234", member.password)).isTrue()
        assertThat(passwordService.matches("1234", findMember.password)).isTrue()
    }


}