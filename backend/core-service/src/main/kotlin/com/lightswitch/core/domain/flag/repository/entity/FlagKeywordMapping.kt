package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.*

@Entity(name = "flag_keyword_mapping")
class FlagKeywordMapping(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val flagKeywordMappingId: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flag_id")
    val flag: Flag,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "flag_keyword_mapping_keyword",
        joinColumns = [JoinColumn(name = "flag_keyword_mapping_id")],
        inverseJoinColumns = [JoinColumn(name = "keyword_id")]
    )
    val keywords: MutableList<Keyword> = mutableListOf()
) : BaseEntity()