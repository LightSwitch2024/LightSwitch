package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.*

@Entity(name = "property")
class Property(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val propertyId: Long? = null,

    val property: String,
    val data: String,


    @JoinColumn(name = "keyword_id")
    @ManyToOne(fetch = FetchType.LAZY)
    val keyword: Keyword,
) : BaseEntity()