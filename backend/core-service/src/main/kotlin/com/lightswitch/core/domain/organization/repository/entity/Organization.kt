package com.lightswitch.core.domain.organization.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.member.entity.Member
import jakarta.persistence.*

@Entity
class Organization(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val organizationId: Long? = null,
    var name: String,
    var sdkKey: String,

    @OneToOne
    @JoinColumn(name = "owner_id")
    val owner: Member
) : BaseEntity()