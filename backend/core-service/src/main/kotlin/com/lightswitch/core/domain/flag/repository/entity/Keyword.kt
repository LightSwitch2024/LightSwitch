package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.*

@Entity(name = "keyword")
class
Keyword(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val keywordId: Long? = null,

    @JoinColumn(name = "flag_id")
    @ManyToOne(fetch = FetchType.LAZY)
    val flag: Flag,

    @OneToMany(mappedBy = "keyword", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val properties: MutableList<Property> = mutableListOf(),

    val description: String,
    val value: String,
) : BaseEntity()