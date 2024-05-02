package com.lightswitch.core.domain.member.dto.res

data class MemberResponseDto(
    val memberId: Long,
    val firstName: String,
    val lastName: String,
    val telNumber: String,
    val password: String,
    val email: String,
    var sdkKey: String,
    val createdAt: String,
    val updatedAt: String,
    val deletedAt: String,
)