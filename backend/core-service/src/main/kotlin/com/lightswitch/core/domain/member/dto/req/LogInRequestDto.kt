package com.lightswitch.core.domain.member.dto.req

import jakarta.validation.constraints.NotBlank

data class LogInRequestDto (
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val password: String
)