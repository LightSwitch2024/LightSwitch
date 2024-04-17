package com.lightswitch.logservice.domain.log.repository

import com.lightswitch.logservice.domain.log.entity.Log
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface LogRepository : MongoRepository<Log, String> {
    @Query("{ 'json.name': ?0 }")
    fun findByJsonName(value: String): List<Log>

    @Query("{ 'json.location': ?0 }")
    fun findByJsonLocation(value: String): List<Log>
}