package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.flag.common.enum.FlagType
import jakarta.persistence.*
import lombok.Getter

@Entity(name = "flag")
class Flag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val flagId: Long? = null,

    val title: String,
    val description: String,

    // Todo : Change to User
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id")
    val maintainerId: Long,

    @Enumerated(EnumType.STRING)
    var type: FlagType,

    @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinTable(
        name = "flag_tag",
        joinColumns = [JoinColumn(name = "flag_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableList<Tag> = mutableListOf(),
    val active: Boolean = false,
) : BaseEntity()