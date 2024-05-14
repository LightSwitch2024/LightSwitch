package com.lightswitch.core.domain.history.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import com.lightswitch.core.domain.flag.repository.entity.Flag
import jakarta.persistence.*

@Entity
class History(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val historyId: Long? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flag_id", referencedColumnName = "flagId")
    val flag: Flag,
    @Enumerated(EnumType.STRING)
    val action: HistoryType,
    val target: String? = null,
    val previous: String? = null,
    val current: String? = null,
) : BaseEntity()
