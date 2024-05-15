package com.lightswitch.core.domain.organization.dto.req

data class CreateOrganizationRequestDto(
    val name: String,
    val ownerId: Long
)