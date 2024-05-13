package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.common.service.PasswordService
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Tag
import com.lightswitch.core.domain.flag.service.FlagService
import com.lightswitch.core.domain.member.dto.req.PasswordUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.LogInReqDto
import com.lightswitch.core.domain.member.dto.req.MemberUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.OrgReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.dto.res.MemberResponseDto
import com.lightswitch.core.domain.member.dto.res.OrgResDto
import com.lightswitch.core.domain.member.dto.res.SdkKeyResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.entity.Organization
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.repository.OrganizationRepository
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import com.lightswitch.core.domain.redis.service.RedisService
import org.aspectj.weaver.ast.Or
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.regex.Matcher
import java.util.regex.Pattern
import java.time.LocalDateTime

@Transactional
@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val passwordService: PasswordService,
    private val redisService: RedisService,
    private val sdkKeyRepository: SdkKeyRepository,
    private val flagRepository: FlagRepository,
    private val flagService: FlagService,
    private val organizationRepository: OrganizationRepository,
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
            password = encodedPassword,
            organization = null,
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
                ?: throw BaseException(ResponseCode.MEMBER_NOT_FOUND)
        // 회원가입 후 로그인할 때 isCorrectPW 코드
        val isCorrectPW = passwordService.matches(logInReqDto.password, savedMember.password)
        println(savedMember.memberId)

        return if (isCorrectPW) {
            MemberResDto(
                memberId = savedMember.memberId!!,
                email = savedMember.email,
                firstName = savedMember.firstName,
                lastName = savedMember.lastName,
                telNumber = savedMember.telNumber,
                organization = savedMember.organization?.name.toString(),
            )
        } else {
            throw BaseException(ResponseCode.INVALID_PASSWORD)
        }
    }

    // 첫 로그인 시, orgId가 null일 때, 추가로 받아 채움(이미존재하는회사:멤버로 추가, 존재하지않는회사: 신규생성 및 owner설정)
    fun fillOrg(orgReqDto: OrgReqDto): OrgResDto {
        val orgMem = memberRepository.findByEmailAndDeletedAtIsNull(orgReqDto.email) ?: throw BaseException(
            ResponseCode.MEMBER_NOT_FOUND
        )

        val savedOrg = organizationRepository.findByNameAndDeletedAtIsNull(orgReqDto.orgName)

        val addOrgMem: Member = Member(
            memberId = orgMem.memberId!!,
            email = orgMem.email,
            firstName = orgMem.firstName,
            lastName = orgMem.lastName,
            telNumber = orgMem.telNumber,
            password = orgMem.password,
            organization = null,
        )

        // 기존에 org 가 존재했다면
        if (savedOrg != null) {
            // org members에 추가하고,
            val savedMemberList = mutableListOf<Member>()
            savedMemberList.add(orgMem)
            savedOrg.members.addAll(savedMemberList)
            // member 정보에 org 정보 추가
            addOrgMem.organization = savedOrg
        } else {
            // 새로 만들어야할 org라면
            val newOrg: Organization = Organization(
                name = orgReqDto.orgName,
                owner = orgMem
            )
            // org를 생성하고
            organizationRepository.save(newOrg)
            // member 정보에 org 추가
            addOrgMem.organization = newOrg
        }

        return OrgResDto(
            organizationName = orgMem.organization?.name.toString(),
        )
    }

    // 유저 정보 읽기
    fun getUser(email: String): MemberResDto {
        val savedMember =
            memberRepository.findByEmailAndDeletedAtIsNull(email) ?: throw BaseException(ResponseCode.MEMBER_NOT_FOUND)

        return MemberResDto(
            memberId = savedMember.memberId!!,
            email = savedMember.email,
            firstName = savedMember.firstName,
            lastName = savedMember.lastName,
            telNumber = savedMember.telNumber,
            organization = savedMember.organization?.name.toString(),
        )
    }

    // 유저 정보 삭제
    fun deleteUser(memberId: Long): MemberResponseDto {
        val savedUser = memberRepository.findById(memberId)
            .orElseThrow { throw BaseException(ResponseCode.MEMBER_NOT_FOUND) }

        savedUser.delete()

        sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(savedUser.memberId!!)?.delete()

        flagRepository.findByMaintainerMemberIdAndDeletedAtIsNull(savedUser.memberId!!).map {
            flagService.deleteFlag(it.flagId!!)
        }

        savedUser.organization?.let {
            organizationRepository.findByNameAndDeletedAtIsNull(it.name)?.members?.remove(
                savedUser
            )
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
    @Transactional
    fun updateUser(newData: MemberUpdateReqDto): MemberResDto? {
        val savedMember: Member = memberRepository.findByEmailAndDeletedAtIsNull(newData.email) ?: throw BaseException(
            ResponseCode.MEMBER_NOT_FOUND
        )

        val updatedMember: Member = Member(
            memberId = savedMember.memberId!!,
            email = savedMember.email,
            firstName = newData.firstName,
            lastName = newData.lastName,
            telNumber = newData.telNumber,
            password = savedMember.password
        )

        memberRepository.save(updatedMember)

        return MemberResDto(
            memberId = savedMember.memberId!!,
            firstName = savedMember.firstName,
            lastName = savedMember.lastName,
            telNumber = savedMember.telNumber,
            email = savedMember.email,
            organization = savedMember.organization?.name.toString(),
        )
    }

    // 비밀번호 변경
    fun updatePassword(update: PasswordUpdateReqDto): MemberResDto? {
        val savedMember: Member = memberRepository.findByEmailAndDeletedAtIsNull(update.email) ?: throw BaseException(
            ResponseCode.MEMBER_NOT_FOUND
        )

        val encodedPassword = passwordService.encode(update.newPassword)

        val updatedMember: Member = Member(
            memberId = savedMember.memberId!!,
            firstName = savedMember.firstName,
            lastName = savedMember.lastName,
            telNumber = savedMember.telNumber,
            email = savedMember.email,
            password = encodedPassword,
//            updatedAt = LocalDateTime.now()
        )

        memberRepository.save(updatedMember)

        return MemberResDto(
            memberId = savedMember.memberId!!,
            firstName = savedMember.firstName,
            lastName = savedMember.lastName,
            telNumber = savedMember.telNumber,
            email = savedMember.email,
            organization = savedMember.organization?.name.toString(),
        )
    }

    /*
    * 테스트 코드 setUp()에서 사용하기 위해 추가
    * SdkKey는 Member와 CascadeType.ALL로 연결되어 있기 때문에 Member 삭제 시 함께 삭제
    * */
    fun deleteAll() {
        memberRepository.deleteAll()
    }

}
