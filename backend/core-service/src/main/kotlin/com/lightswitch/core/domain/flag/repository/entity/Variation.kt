package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.history.dto.PreVariation
import jakarta.persistence.*

@Entity(name = "variation")
class Variation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val variationId: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flag_id")
    val flag: Flag,

    var value: String,
    var portion: Int,
    var description: String,

    val defaultFlag: Boolean = false,
) : BaseEntity() {

    fun toPrevious(): PreVariation {
        return PreVariation(this)
    }
}