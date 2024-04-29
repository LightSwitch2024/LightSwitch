package com.lightswitch.core.domain.mail.dto.req

import jakarta.validation.constraints.NotBlank

class MailCheckReqDto(
    @field:NotBlank
    val email: String,

    @field:NotBlank
    val authCode: String
)
