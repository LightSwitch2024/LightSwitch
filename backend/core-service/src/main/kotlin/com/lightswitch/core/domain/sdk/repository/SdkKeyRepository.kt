package com.lightswitch.core.domain.sdk.repository

import com.lightswitch.core.domain.sdk.repository.entity.SdkKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SdkKeyRepository : JpaRepository<SdkKey, Long> {
    fun findByMemberMemberId(memberId: Long): List<SdkKey>

    fun findByKey(key: String): SdkKey?

    fun findByMemberMemberIdAndDeletedAtIsNull(memberId: Long): SdkKey?
}