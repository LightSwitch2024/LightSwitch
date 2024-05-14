package com.lightswitch.core.domain.member.dto.res

import jakarta.validation.constraints.NotBlank

data class OrgResDto(
    @field:NotBlank
    val organizationName: String,
)
