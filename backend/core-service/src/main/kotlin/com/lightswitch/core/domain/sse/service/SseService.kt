package com.lightswitch.core.domain.sse.service

import com.lightswitch.core.domain.flag.dto.req.UserKeyRequestDto
import com.lightswitch.core.domain.sse.dto.SseDto
import com.lightswitch.core.domain.sse.dto.req.SseRequestDto
import com.lightswitch.core.domain.sse.dto.res.SseUserKeyResponseDto
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.security.MessageDigest
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

private val logger = KotlinLogging.logger {}
@Service
class SseService {

    private val map: ConcurrentMap<String, SseEmitter> = ConcurrentHashMap()

    fun subscribe(userKey: String): SseEmitter {
        val emitter = createEmitter()
        emitter.onTimeout {
            logger.error { "sse timeout, $userKey" }
            emitter.complete()
        }

        emitter.onError {
            logger.error { "sse error $userKey" }
            emitter.complete()
        }

        emitter.onCompletion {
            logger.error { "sse completion $userKey" }
            map.remove(userKey)
        }

        map[userKey] = emitter
        try {
            val event = SseEmitter.event()
                .name("sse")
                .data("SSE connected")
            emitter.send(event)
        } catch (e: Exception) {
            logger.error { "send sse init data failed, $userKey" }
        }


        return emitter
    }

    fun sendData(sseDto: SseDto) {
        // 전체 emitter에 전송

        map.forEach { (_, emitter) ->
            try {
                val event = SseEmitter.event()
                    .name("sse")
                    .data(sseDto)
                emitter.send(event)
            } catch (e: Exception) {
                logger.error { "send sse data failed, $sseDto" }
            }
        }
    }

    fun sendData2(sseDto: SseDto) {
        val emitter: SseEmitter? = map[sseDto.userKey]

        emitter?.let {

            val event = SseEmitter.event()
                .name("sse")
                .data(sseDto)
            emitter.send(event)
        }
    }

    private fun createEmitter(): SseEmitter {
        return SseEmitter(Long.MAX_VALUE)
    }

    fun createUserKey(sseRequestDto: SseRequestDto): SseUserKeyResponseDto {
        return SseUserKeyResponseDto(userKey = UUID.randomUUID().toString())
    }

    fun hash(value: String): String {
        val bytes = value.toByteArray()
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(bytes)
        return digest.fold("") { str, d -> str + "%02x".format(d) }
    }

    fun disconnect(userKey: UserKeyRequestDto) {

        val emitter: SseEmitter? = map[userKey.userKey]

        emitter?.let {
            val event = SseEmitter.event()
                .name("disconnect")
            emitter.send(event)
        }
        map.remove(userKey.userKey)
    }
}