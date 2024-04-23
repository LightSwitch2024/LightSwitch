package com.lightswitch.core.domain.redis.service

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@Service
class RedisService (
    private val redisTemplate: StringRedisTemplate
) {
    fun save(key: String, value: String) {
        redisTemplate.opsForValue().set(key, value)
    }

    fun saveWithExpire(key: String, value: String, expireTime: Long) {
        redisTemplate.opsForValue().set(key, value, java.time.Duration.ofSeconds(expireTime))
    }

    fun find(key: String): String? {
        return redisTemplate.opsForValue().get(key)
    }

    fun delete(key: String) {
        redisTemplate.delete(key)
    }
}