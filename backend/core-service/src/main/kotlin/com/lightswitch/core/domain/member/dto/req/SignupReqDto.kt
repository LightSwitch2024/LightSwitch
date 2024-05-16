package com.lightswitch.core.domain.member.dto.req

import jakarta.validation.constraints.NotBlank

class SignupReqDto(
    @field:NotBlank
    val firstName: String,
    @field:NotBlank
    val lastName: String,
    @field:NotBlank
    val telNumber: String,
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val password: String,
)