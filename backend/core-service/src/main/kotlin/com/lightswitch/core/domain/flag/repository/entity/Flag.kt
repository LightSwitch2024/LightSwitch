package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.history.dto.PreFlag
import com.lightswitch.core.domain.history.repository.entity.History
import com.lightswitch.core.domain.member.entity.Member
import jakarta.persistence.*

@Entity(name = "flag")
class Flag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val flagId: Long? = null,

    var title: String,
    var description: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    val maintainer: Member,

    @Enumerated(EnumType.STRING)
    var type: FlagType,

    @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinTable(
        name = "flag_tag",
        joinColumns = [JoinColumn(name = "flag_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableList<Tag> = mutableListOf(),

    @OneToMany(mappedBy = "flag", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val keywords: MutableList<Keyword> = mutableListOf(),

    var active: Boolean = false,

    @OneToMany(mappedBy = "flag", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val histories: MutableList<History> = mutableListOf(),
) : BaseEntity() {

    fun toPrevious(): PreFlag {
        return PreFlag(this)
    }
}