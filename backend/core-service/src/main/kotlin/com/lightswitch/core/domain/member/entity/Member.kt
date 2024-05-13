package com.lightswitch.core.domain.member.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.organization.repository.entity.Organization
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

    @OneToOne(mappedBy = "owner", fetch = FetchType.LAZY)
    var organization: Organization? = null

) : BaseEntity()