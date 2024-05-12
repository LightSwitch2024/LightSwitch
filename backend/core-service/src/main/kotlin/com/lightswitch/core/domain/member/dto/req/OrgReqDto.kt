package com.lightswitch.core.domain.member.dto.req

import jakarta.validation.constraints.NotBlank

data class OrgReqDto (
    @field:NotBlank
    val memberId: Long,
    @field:NotBlank
    val orgName: String,
)