package com.lightswitch.core.domain.organization.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.organization.dto.req.CreateOrganizationRequestDto
import com.lightswitch.core.domain.organization.dto.res.OrganizationResponseDto
import com.lightswitch.core.domain.organization.service.OrganizationService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/organization")
class OrganizationController(
    private val organizationService: OrganizationService
) {

    @PostMapping("")
    fun createOrganization(@RequestBody createOrganizationRequestDto: CreateOrganizationRequestDto): BaseResponse<OrganizationResponseDto> {
        return success(organizationService.createOrganization(createOrganizationRequestDto))
    }

    @GetMapping("/sdk-key")
    fun getSdkKey(): BaseResponse<String> {
        return success(organizationService.getSdkKey())
    }
}