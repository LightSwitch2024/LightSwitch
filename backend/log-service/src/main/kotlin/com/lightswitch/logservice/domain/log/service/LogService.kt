package com.lightswitch.logservice.domain.log.service

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.lightswitch.logservice.domain.log.entity.Log
import com.lightswitch.logservice.domain.log.repository.LogRepository
import org.springframework.stereotype.Service

@Service
class LogService(
    private val logRepository: LogRepository,
    private val gson: Gson = Gson()
) {

    fun addLog(userKey: String, json: String) {
        val jsonMap: Map<String, Any> = gson.fromJson(json, object : TypeToken<Map<String, Any>>() {}.type)
        logRepository.save(Log(userKey = userKey, json = jsonMap))
    }

    fun findByJsonName(name: String): List<Log> {
        return logRepository.findByJsonName(name)
    }

    fun findByJsonLocation(location: String): List<Log> {
        return logRepository.findByJsonLocation(location)
    }

    fun deleteAllLogs() {
        logRepository.deleteAll()
    }
}