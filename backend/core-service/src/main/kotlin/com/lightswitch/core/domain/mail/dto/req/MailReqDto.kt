package com.lightswitch.core.domain.mail.dto.req

import jakarta.validation.constraints.NotBlank

class MailReqDto (
    @field:NotBlank
    val email: String
)