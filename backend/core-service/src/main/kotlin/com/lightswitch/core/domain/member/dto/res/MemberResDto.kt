package com.lightswitch.core.domain.member.dto.res

import jakarta.validation.constraints.NotBlank

data class MemberResDto(
    val memberId: Long,
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val firstName: String,
    @field:NotBlank
    val lastName: String,
    @field:NotBlank
    val telNumber: String,
    @field:NotBlank
    val orgName: String,
)