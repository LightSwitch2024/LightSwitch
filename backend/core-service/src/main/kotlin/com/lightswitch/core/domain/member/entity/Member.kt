package com.lightswitch.core.domain.member.entity

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

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var sdkKeys: MutableList<SdkKey> = mutableListOf()
)