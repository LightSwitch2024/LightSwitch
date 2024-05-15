package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.history.dto.PreProperty
import jakarta.persistence.*

@Entity(name = "property")
class Property(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val propertyId: Long? = null,

    var property: String,
    var data: String,

    @JoinColumn(name = "keyword_id")
    @ManyToOne(fetch = FetchType.LAZY)
    val keyword: Keyword,
) : BaseEntity(){

    fun toPrevious(): PreProperty {
        return PreProperty(this)
    }
}