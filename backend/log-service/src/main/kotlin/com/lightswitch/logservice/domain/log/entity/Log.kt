package com.lightswitch.logservice.domain.log.entity

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "logs")
data class Log(
    @Id
    val userKey: String? = null,
    val json: Map<String, Any>,
)