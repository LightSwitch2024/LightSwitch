package com.lightswitch.core.domain.member.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

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

    ) : BaseEntity()