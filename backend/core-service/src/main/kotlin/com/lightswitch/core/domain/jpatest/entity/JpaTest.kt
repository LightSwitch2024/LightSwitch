package com.lightswitch.core.domain.jpatest.entity

import jakarta.persistence.*

@Entity(name = "jpa_test")
class JpaTest(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val jpaTestId: Long? = null,
    val name: String,

    @JoinColumn(name = "jpa_test_fetch_id")
    @ManyToOne(fetch = FetchType.LAZY)
    val jpaTestFetch: JpaTestFetch
)