package com.lightswitch.core.domain.member.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.SdkKeyReqDto
import com.lightswitch.core.domain.member.dto.res.SdkKeyResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.entity.SdkKey
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class SdkKeyService(
    private val sdkKeyRepository: SdkKeyRepository,
    private val memberRepository: MemberRepository
) {

    fun createSdkKey(sdkKeyReqDto: SdkKeyReqDto): SdkKeyResDto {

        val email = sdkKeyReqDto.email
        val member: Member = memberRepository.findByEmailAndDeletedAtIsNull(email) ?: throw BaseException(
            ResponseCode.MEMBER_NOT_FOUND
        )

        sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(member.memberId!!)?.let {
            throw BaseException(
                ResponseCode.SDK_KEY_ALREADY_EXISTS
            )
        }

        var newKey = ""
        while (true) {
            newKey = generateSdkKey()
            sdkKeyRepository.findByKey(newKey) ?: break
        }

        val newSdkKey = SdkKey(
            member = member,
            key = newKey
        )

        return SdkKeyResDto(key = sdkKeyRepository.save(newSdkKey).key)
    }

    fun generateSdkKey(): String {
        var key = UUID.randomUUID().toString()
        key = key.replace("-", "")
        return key
    }

    fun getSdkKeyForOverview(memberId: Long): Map<String, String> {
        val sdkKey = sdkKeyRepository.findByMemberMemberIdAndDeletedAtIsNull(memberId) ?: throw BaseException(
            ResponseCode.SDK_KEY_NOT_FOUND
        )
        return mapOf("sdkKey" to sdkKey.key)
    }
}