package com.lightswitch.core.domain.organization.dto.res

data class OrganizationResponseDto(
    val id: Long,
    val name: String,
    val sdkKey: String,
    val ownerId: Long
)