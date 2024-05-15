package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.common.entity.BaseEntity
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany

@Entity(name = "tag")
class Tag(
    val colorHex: String,
    @Id
    val content: String,

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    val flags: MutableList<Flag> = mutableListOf()
) : BaseEntity()