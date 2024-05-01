package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.*

@Entity(name = "keyword")
class Keyword(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val keywordId: Long? = null,

    val keyword: String,
    val description: String,

    @ManyToMany(mappedBy = "keywords", fetch = FetchType.LAZY)
    val flagKeywordMappings: MutableList<FlagKeywordMapping> = mutableListOf()
) : BaseEntity()