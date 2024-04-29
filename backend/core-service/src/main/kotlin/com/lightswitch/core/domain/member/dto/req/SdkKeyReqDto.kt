package com.lightswitch.core.domain.member.dto.req

import jakarta.validation.constraints.NotBlank

class SdkKeyReqDto(
    @field:NotBlank
    val email: String
)