package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.member.dto.req.LogInReqDto
import com.lightswitch.core.domain.member.dto.req.MemberUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.PasswordUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
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

    fun logIn(logInReqDto: LogInReqDto): MemberResDto {

        val savedMember: Member? = memberRepository.findByEmail(logInReqDto.email)
        var savedPassword: String = ""

        savedMember?.let {
            savedPassword = savedMember.password
            print(savedPassword)
        }

        val isCorrectPW = passwordService.matches(logInReqDto.password,savedPassword)
        return if (isCorrectPW && savedMember != null) {
            MemberResDto(
                email = savedMember.email,
                firstName = savedMember.firstName,
                lastName = savedMember.lastName,
                telNumber = savedMember.telNumber
            )
        } else {
            throw MemberException("비밀번호가 틀렸습니다.")
        }

//        return if (savedMember != null && logInReqDto.password == savedPassword) {
//            MemberResDto(
//                email = savedMember.email,
//                firstName = savedMember.firstName,
//                lastName = savedMember.lastName,
//                telNumber = savedMember.telNumber
//            )
//        } else {
//            throw MemberException("비밀번호가 틀렸습니다.")
//        }
    }

//     유저 정보 읽기
    fun getUser(email: String): MemberResDto {
        val savedMember = memberRepository.findByEmail(email)

        return if (savedMember != null) {
            MemberResDto(
                email = savedMember.email,
                firstName = savedMember.firstName,
                lastName = savedMember.lastName,
                telNumber = savedMember.telNumber,
            )
        } else {
            throw MemberException("비밀번호가 틀렸습니다.")
        }
    }

    // 유저 정보 삭제
//    @Transactional
//    fun deleteUser(email: String): Long {
//        val flag = memberRepository.findByEmail(email)
//        flag.delete()
//
//        //flag에 연결된 variation 삭제
//        val variations = variationRepository.findByFlag(flag)
//        for (variation in variations) {
//            variation.delete()
//        }
//
//        return flag.flagId ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
//    }

    // 이름, 전화번호 변경
    fun modifyUserdata(newData: MemberUpdateReqDto): MemberResDto? {
        val oldData: Member? = memberRepository.findByEmail(newData.email)
        oldData?.let{
            oldData.firstName = newData.firstName
            oldData.lastName = newData.lastName
            oldData.telNumber = newData.telNumber
            oldData.email = newData.email
            memberRepository.save(it)
        }

        val updatedData: MemberResDto? = oldData?.let {
            MemberResDto(
                firstName = it.firstName,
                lastName = it.lastName,
                telNumber = it.telNumber,
                email = it.email
            )
        }
        return updatedData
    }

    // 비밀번호 변경
    fun modifyPassword(newData: PasswordUpdateReqDto): MemberResDto? {
        val savedMember: Member? = memberRepository.findByEmail(newData.email)

        if (savedMember != null && passwordService.matches(newData.oldPassword,savedMember.password)) {
            savedMember.password = newData.newPassword
            memberRepository.save(savedMember)
        } else {
            throw MemberException("입력하신 비밀번호가 틀렸습니다.")
        }

        val updatedData: MemberResDto = savedMember.let {
            MemberResDto(
                email = it.email,
                firstName = it.firstName,
                lastName = it.lastName,
                telNumber = it.telNumber,
            )
        }
        return updatedData
    }

}