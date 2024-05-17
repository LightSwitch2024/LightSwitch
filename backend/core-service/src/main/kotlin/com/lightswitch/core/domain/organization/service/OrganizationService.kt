package com.lightswitch.core.domain.organization.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.service.SdkKeyService
import com.lightswitch.core.domain.organization.dto.req.CreateOrganizationRequestDto
import com.lightswitch.core.domain.organization.dto.res.OrganizationResponseDto
import com.lightswitch.core.domain.organization.repository.OrganizationRepository
import com.lightswitch.core.domain.organization.repository.entity.Organization
import org.springframework.stereotype.Service

@Service
class OrganizationService(
    private val organizationRepository: OrganizationRepository,

    private val sdkKeyService: SdkKeyService,

    private val memberRepository: MemberRepository
) {

    fun createOrganization(createOrganizationRequestDto: CreateOrganizationRequestDto): OrganizationResponseDto {
        // organization 하나라도 데이터가 존재하면 exception 발생
        if (organizationRepository.findAll().isNotEmpty()) {
            throw BaseException(ResponseCode.ORGANIZATION_ALREADY_EXISTS)
        }

        val sdkKey = sdkKeyService.generateSdkKey()
        val owner = memberRepository.findById(createOrganizationRequestDto.ownerId)
            .orElseThrow { throw BaseException(ResponseCode.MEMBER_NOT_FOUND) }

        val savedOrganization = organizationRepository.save(
            Organization(
                name = createOrganizationRequestDto.name,
                sdkKey = sdkKey,
                owner = owner,
            )
        )

//        // 멤버 orgName 에 org저장.
//        memberRepository.save(
//            Member(
//                memberId = owner.memberId!!,
//                email = owner.email,
//                firstName = owner.firstName,
//                lastName = owner.lastName,
//                telNumber = owner.telNumber,
//                password = owner.password,
//            )
//        )

        return OrganizationResponseDto(
            id = savedOrganization.organizationId!!,
            name = savedOrganization.name,
            sdkKey = savedOrganization.sdkKey,
            ownerId = savedOrganization.owner.memberId!!
        )
    }

    fun getSdkKey(): String {
        val organization =
            organizationRepository.findAll()[0] ?: throw BaseException(ResponseCode.ORGANIZATION_NOT_FOUND)

        return organization.sdkKey
    }
}