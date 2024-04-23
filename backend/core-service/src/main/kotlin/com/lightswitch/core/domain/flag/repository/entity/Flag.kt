package com.lightswitch.core.domain.flag.repository.entity

import jakarta.persistence.*
import lombok.Getter

@Entity(name="flag")
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

//    var type : FlagType
    val type: String,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "flag_tag",
        joinColumns = [JoinColumn(name = "flag_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableList<Tag> = mutableListOf(),
)