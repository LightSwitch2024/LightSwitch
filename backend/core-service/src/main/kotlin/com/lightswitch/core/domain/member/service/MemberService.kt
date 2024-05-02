package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.member.dto.req.LogInReqDto
import com.lightswitch.core.domain.member.dto.req.MemberUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.PasswordUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.dto.res.MemberResponseDto
import com.lightswitch.core.domain.member.dto.res.SdkKeyResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.regex.Matcher
import java.util.regex.Pattern

@Transactional
@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val passwordService: PasswordService,
    private val redisService: RedisService,
    private val sdkKeyRepository: SdkKeyRepository,
    private val flagRepository: FlagRepository,
    @Value("\${spring.data.redis.code.signup}")
    val signupCode: String
) {

    fun signUp(signupReqDto: SignupReqDto): MemberResponseDto {

        var firstName = signupReqDto.firstName
        var lastName = signupReqDto.lastName
        var phoneNumber = signupReqDto.telNumber
        val email = signupReqDto.email
        val password = signupReqDto.password
        val authCode = signupReqDto.authCode

        val existsMember: Member? = memberRepository.findByEmailAndDeletedAtIsNull(email)
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

        val savedMember = memberRepository.save(member)
        val sdkKey = sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(savedMember.memberId!!)

        return MemberResponseDto(
            memberId = savedMember.memberId!!,
            firstName = savedMember.firstName,
            lastName = savedMember.lastName,
            telNumber = savedMember.telNumber,
            email = savedMember.email,
            password = savedMember.password,
            sdkKey = sdkKey?.key ?: "",
            createdAt = savedMember.createdAt.toString(),
            updatedAt = savedMember.updatedAt.toString(),
            deletedAt = savedMember.deletedAt?.toString() ?: "",
        )
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

        val savedMember: Member =
            memberRepository.findByEmailAndDeletedAtIsNull(logInReqDto.email)
                ?: throw MemberException("가입되지 않은 이메일입니다.")

        val isCorrectPW = passwordService.matches(logInReqDto.password, savedMember.password)

        return if (isCorrectPW) {
            MemberResDto(
                memberId = savedMember.memberId!!,
                email = savedMember.email,
                firstName = savedMember.firstName,
                lastName = savedMember.lastName,
                telNumber = savedMember.telNumber
            )
        } else {
            throw MemberException("비밀번호가 틀렸습니다.")
        }
    }

    //     유저 정보 읽기
    fun getUser(email: String): MemberResDto {
        val savedMember = memberRepository.findByEmailAndDeletedAtIsNull(email)
        println("service 진행됌")
        println(savedMember?.email)

        return if (savedMember != null) {
            MemberResDto(
                memberId = savedMember.memberId!!,
                email = savedMember.email,
                firstName = savedMember.firstName,
                lastName = savedMember.lastName,
                telNumber = savedMember.telNumber,
            )
        } else {
            throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        }
    }

    //     유저 정보 삭제
    fun deleteUser(memberId: Long): MemberResponseDto {
        val savedUser = memberRepository.findById(memberId)
            .orElseThrow { throw BaseException(ResponseCode.MEMBER_NOT_FOUND) }

        savedUser.delete()

        sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(savedUser.memberId!!)?.delete()

        flagRepository.findByMaintainerMemberIdAndDeletedAtIsNull(savedUser.memberId!!).map {
            it.delete()
        }

        return MemberResponseDto(
            memberId = savedUser.memberId!!,
            firstName = savedUser.firstName,
            lastName = savedUser.lastName,
            telNumber = savedUser.telNumber,
            email = savedUser.email,
            password = savedUser.password,
            sdkKey = "",
            createdAt = savedUser.createdAt.toString(),
            updatedAt = savedUser.updatedAt.toString(),
            deletedAt = savedUser.deletedAt.toString(),
        )
    }

    // 이름, 전화번호 변경
    fun updateUser(email: String, newData: MemberUpdateReqDto): MemberResDto? {
        val oldData: Member? = memberRepository.findByEmailAndDeletedAtIsNull(email)
        oldData?.let {
            oldData.firstName = newData.firstName
            oldData.lastName = newData.lastName
            oldData.telNumber = newData.telNumber
            oldData.email = newData.email
            memberRepository.save(it)
        }

        val updatedData: MemberResDto? = oldData?.let {
            MemberResDto(
                memberId = it.memberId!!,
                firstName = it.firstName,
                lastName = it.lastName,
                telNumber = it.telNumber,
                email = it.email
            )
        }
        return updatedData
    }

    // 비밀번호 변경
    fun updatePassword(email: String, newData: PasswordUpdateReqDto): MemberResDto? {
        val savedMember: Member? = memberRepository.findByEmailAndDeletedAtIsNull(email)

        if (savedMember != null && passwordService.matches(newData.oldPassword, savedMember.password)) {
            savedMember.password = newData.newPassword
            memberRepository.save(savedMember)
        } else {
            throw MemberException("입력하신 비밀번호가 틀렸습니다.")
        }

        val updatedData: MemberResDto = savedMember.let {
            MemberResDto(
                memberId = it.memberId!!,
                email = it.email,
                firstName = it.firstName,
                lastName = it.lastName,
                telNumber = it.telNumber,
            )
        }
        return updatedData
    }

    /*
    * 테스트 코드 setUp()에서 사용하기 위해 추가
    * SdkKey는 Member와 CascadeType.ALL로 연결되어 있기 때문에 Member 삭제 시 함께 삭제
    * */
    fun deleteAll() {
        memberRepository.deleteAll()
    }

}