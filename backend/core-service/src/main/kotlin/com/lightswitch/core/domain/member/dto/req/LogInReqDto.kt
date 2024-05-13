package com.lightswitch.core.domain.member.dto.req

import jakarta.validation.constraints.NotBlank

data class LogInReqDto(
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val password: String
)