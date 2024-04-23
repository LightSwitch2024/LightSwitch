package com.lightswitch.core.domain.flag.repository.entity

import jakarta.persistence.*
import lombok.Getter

@Entity(name="tag")
class Tag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val tagId: Long? = null,

    val colorHex: String,
    val content: String,

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    val flags: MutableList<Flag> = mutableListOf()
)