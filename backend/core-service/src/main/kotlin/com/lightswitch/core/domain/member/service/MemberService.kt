package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.regex.Matcher
import java.util.regex.Pattern

@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val passwordService: PasswordService,
    private val redisService: RedisService,
    @Value("\${spring.data.redis.code.signup}")
    val signupCode: String
) {

    fun signUp(signupReqDto: SignupReqDto): Member {

        var firstName = signupReqDto.firstName
        var lastName = signupReqDto.lastName
        var phoneNumber = signupReqDto.telNumber
        val email = signupReqDto.email
        val password = signupReqDto.password
        val authCode = signupReqDto.authCode

        val existsMember: Member? = memberRepository.findByEmail(email)
        existsMember?.let {
            throw MemberException("이미 가입된 이메일 입니다.")
        }

        redisService.find("$signupCode:$email") ?: throw MemberException("코드 만료 시간이 지났습니다.")

        if (authCode != redisService.find("$signupCode:$email")) {
            throw MemberException("인증 코드가 일치하지 않습니다.")
        }

        val encodedPassword = passwordService.encode(password)

        val member: Member = Member(
            firstName = firstName,
            lastName = lastName,
            telNumber = phoneNumber,
            email = email,
            password = encodedPassword
        )

        return memberRepository.save(member)
    }

    fun validateHangle(name: String): Boolean {
        val pattern: Pattern = Pattern.compile("^[가-힣]+\$")
        val matcher: Matcher = pattern.matcher(name)
        return matcher.matches()
    }

    fun validatePhoneNumber(phoneNumber: String): Boolean {
        val pattern: Pattern = Pattern.compile("^01(0|1|[6-9])[0-9]{3,4}[0-9]{4}\$")
        val matcher: Matcher = pattern.matcher(phoneNumber)
        return matcher.matches()
    }

    fun validateEmail(email: String): Boolean {
        val pattern: Pattern = Pattern.compile("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
        val matcher: Matcher = pattern.matcher(email)
        return matcher.matches()
    }

    fun validatePassword(password: String): Boolean {
        val pattern: Pattern = Pattern.compile("^(?=.*[a-zA-Z])(?=.*[!@#\$%^*+=-])(?=.*[0-9]).{8,15}\$")
        val matcher: Matcher = pattern.matcher(password)
        return matcher.matches()
    }

    fun logIn(email: String, password: String): Boolean {

        val savedMember: Member? = memberRepository.findByEmail(email)
        var savedPassword: String = ""

        savedMember?.let {
            savedPassword = savedMember.password
        }

        val encodedPassword = passwordService.encode(password)

        if (savedPassword == encodedPassword) {
            return true
        } else {
            throw MemberException("비밀번호가 틀렸습니다.")
        }
    }

    // 이름, 전화번호 변경
    fun modifyUserdata(email: String, newData: MemberResDto): Member? {
        val oldData: Member? = memberRepository.findByEmail(email)
        oldData?.let {
            oldData.firstName = newData.firstName
            oldData.lastName = newData.lastName
            oldData.telNumber = newData.telNumber
        }
        return oldData?.let { memberRepository.save(it) }
    }

    // 비밀번호 변경
    fun modifyPassword(email: String, newPassword: String): Member? {
        val user: Member? = memberRepository.findByEmail(email)
        user?.let {
            user.password = newPassword
        }
        return user?.let { memberRepository.save(it) }
    }

    /*
    * 테스트 코드 setUp()에서 사용하기 위해 추가
    * SdkKey는 Member와 CascadeType.ALL로 연결되어 있기 때문에 Member 삭제 시 함께 삭제
    * */
    fun deleteAll() {
        memberRepository.deleteAll()
    }

}