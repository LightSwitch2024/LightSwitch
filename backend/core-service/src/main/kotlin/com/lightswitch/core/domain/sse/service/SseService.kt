package com.lightswitch.core.domain.sse.service

import com.lightswitch.core.domain.flag.dto.req.UserKeyRequestDto
import com.lightswitch.core.domain.sse.dto.SseDto
import com.lightswitch.core.domain.sse.dto.req.SseRequestDto
import com.lightswitch.core.domain.sse.dto.res.SseUserKeyResponseDto
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.security.MessageDigest
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

@Service
class SseService {

    private val map: ConcurrentMap<String, SseEmitter> = ConcurrentHashMap()

    fun subscribe(userKey: String): SseEmitter {
        val emitter = createEmitter()
        emitter.onTimeout {
            emitter.complete()
        }

        emitter.onError {
            emitter.complete()
        }

        emitter.onCompletion {
            map.remove(userKey)
        }

        map[userKey] = emitter

        val event = SseEmitter.event()
            .name("sse")
            .data("SSE connected")
        emitter.send(event)

        return emitter
    }

    fun sendData(sseDto: SseDto) {
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
        return SseUserKeyResponseDto(userKey = hash(sseRequestDto.sdkKey))
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