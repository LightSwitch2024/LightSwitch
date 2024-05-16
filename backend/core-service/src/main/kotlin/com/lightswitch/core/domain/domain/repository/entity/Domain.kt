package com.lightswitch.core.domain.domain.repository.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.UniqueConstraint
import org.hibernate.validator.constraints.UniqueElements

@Entity(name = "domain")
class Domain(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val domainId: Long? = null,

    @UniqueElements
    val domain: String,
)