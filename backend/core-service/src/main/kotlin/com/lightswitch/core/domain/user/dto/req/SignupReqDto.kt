package com.lightswitch.core.domain.user.dto.req

import jakarta.validation.constraints.NotBlank

class SignupReqDto (
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val password: String,
    @field:NotBlank
    val authCode: String,
)