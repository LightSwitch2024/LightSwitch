package com.lightswitch.core.domain.member.dto.req

import jakarta.validation.constraints.NotBlank

data class PasswordUpdateRequestDto(
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val oldPassword: String,
    @field:NotBlank
    val newPassword: String,
)