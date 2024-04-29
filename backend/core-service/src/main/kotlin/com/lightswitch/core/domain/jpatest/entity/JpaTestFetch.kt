package com.lightswitch.core.domain.jpatest.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity(name = "jpa_test_fetch")
class JpaTestFetch(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val jpaTestFetchId: Long? = null,
    val name: String
)