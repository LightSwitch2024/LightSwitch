package com.lightswitch.core.domain.sdk.dto.req

import jakarta.validation.constraints.NotBlank

class SdkKeyReqDto(
    @field:NotBlank
    val email: String
)