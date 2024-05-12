package com.lightswitch.core.domain.member.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.*

@Entity(name = "member")
class Member(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var memberId: Long? = null,
    var lastName: String,
    var firstName: String,
    var telNumber: String,
    var email: String,
    var password: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = true)
    var organization: Organization? = null,
) : BaseEntity()