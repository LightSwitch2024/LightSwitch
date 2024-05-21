package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.SdkKeyReqDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class SdkKeyServiceTest(
    @Autowired
    private val sdkKeyService: SdkKeyService,

    @Autowired
    private val sdkKeyRepository: SdkKeyRepository,

    @Autowired
    private val memberService: MemberService,

    @Autowired
    private val memberRepository: MemberRepository,
) {

    @BeforeEach
    fun setUp() {
        memberRepository.findAllAByDeletedAtIsNull().map {
            memberService.deleteUser(it.memberId!!)
        }
    }

    fun signup(): Member {
        val member = Member(
            firstName = "동훈",
            lastName = "김",
            telNumber = "01012345678",
            email = "huni19541@gmail.com",
            password = "1234"
        )
        return memberRepository.save(member)
    }

    @Test
    fun `SDK Key 생성_테스트`() {
        val key = sdkKeyService.generateSdkKey()
        Assertions.assertThat(key).isNotNull()
        Assertions.assertThat(key.length).isEqualTo(32)
    }

    @Test
    fun `SDK Key 형식_테스트`() {
        val key = sdkKeyService.generateSdkKey()
        if (key.contains("-")) {
            Assertions.fail<String>("SDK key에 하이픈이 포함되어서는 안 됩니다.")
        }
    }

    @Test
    fun `SDK Key 발급_테스트`() {
        signup()

        val failEmail = "fail@gmail.com"
        Assertions.assertThatExceptionOfType(BaseException::class.java).isThrownBy {
            memberRepository.findByEmailAndDeletedAtIsNull(failEmail)
                ?: throw BaseException(ResponseCode.MEMBER_NOT_FOUND)
        }


        val successEmail = "huni19541@gmail.com"
        val member = memberRepository.findByEmailAndDeletedAtIsNull(successEmail)
            ?: throw BaseException(ResponseCode.MEMBER_NOT_FOUND)

        val existsSdkKey = sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(member.memberId!!)
        Assertions.assertThat(existsSdkKey).isNull()

        val sdkKeyReqDto = SdkKeyReqDto(member.email)
        sdkKeyService.createSdkKey(sdkKeyReqDto)

        val findSdkKey = sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(member.memberId!!)
        Assertions.assertThat(findSdkKey).isNotNull()
    }

    /*
    * Todo...
    *  추후에 SDK 재발급 기능이 추가되면 중복 발급 시
    *  기존 SDK Key Soft Delete 진행 후
    *  새로운 SDK 발급하는 테스트로 코드 변경 해야함.
    * */
    @Test
    fun `SDK Key 중복_발급_예외_테스트`() {
        signup()
        val failEmail = "fail@gmail.com"
        Assertions.assertThatExceptionOfType(BaseException::class.java).isThrownBy {
            memberRepository.findByEmailAndDeletedAtIsNull(failEmail)
                ?: throw BaseException(ResponseCode.MEMBER_NOT_FOUND)
        }


        val successEmail = "huni19541@gmail.com"
        val member = memberRepository.findByEmailAndDeletedAtIsNull(successEmail)
            ?: throw BaseException(ResponseCode.MEMBER_NOT_FOUND)

        val existsSdkKey = sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(member.memberId!!)
        Assertions.assertThat(existsSdkKey).isNull()

        val sdkKeyReqDto = SdkKeyReqDto(member.email)
        sdkKeyService.createSdkKey(sdkKeyReqDto)
        Assertions.assertThatExceptionOfType(BaseException::class.java).isThrownBy {
            sdkKeyService.createSdkKey(sdkKeyReqDto)
        }
    }

    @Test
    fun `SDK 키 조회 by memberId`() {
        // given
        val signupMember = signup()
        val sdkKeyReqDto = SdkKeyReqDto(signupMember.email)
        val createSdkKey = sdkKeyService.createSdkKey(sdkKeyReqDto)

        // when
        val sdkKeyForOverview = sdkKeyService.getSdkKeyForOverview(signupMember.memberId!!)

        // then
        Assertions.assertThat(sdkKeyForOverview["sdkKey"]).isEqualTo(createSdkKey.key)
    }
}