package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.history.dto.PreKeyword
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
    var properties: MutableList<Property> = mutableListOf(),

    var description: String,
    var value: String,
) : BaseEntity() {

    fun toPrevious(): PreKeyword {
        return PreKeyword(this)
    }
}