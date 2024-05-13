package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.flag.common.enum.HistoryType
import jakarta.persistence.*

@Entity
class History(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val historyId: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    val flag: Flag,
    val action: HistoryType,
//    val member: Member,
    val target: String?,
    val previous: String?,
    val current: String?,
) : BaseEntity()
