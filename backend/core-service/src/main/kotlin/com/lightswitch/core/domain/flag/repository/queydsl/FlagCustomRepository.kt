package com.lightswitch.core.domain.flag.repository.queydsl

import com.lightswitch.core.domain.flag.repository.entity.Flag

interface FlagCustomRepository {

    fun findByTagContents(tagContents: List<String>): List<Flag>
}