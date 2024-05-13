package com.lightswitch.core.domain.member.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.Entity
import jakarta.persistence.*

@Entity(name = "organization")
class Organization(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var organizationId: Long? = null,

    var name: String,

    @OneToOne
    @JoinColumn(name = "member_id")
    val owner: Member,

    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var members: MutableList<Member> = mutableListOf()
) : BaseEntity()