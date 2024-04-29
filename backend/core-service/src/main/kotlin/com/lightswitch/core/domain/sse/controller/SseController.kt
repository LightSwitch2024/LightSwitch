package com.lightswitch.core.domain.sse.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap


@Tag(name = "SSE", description = "SSE 관련 API")
@RestController
@RequestMapping("/sse")
class SseController {

    private val map: ConcurrentMap<String, SseEmitter> = ConcurrentHashMap<String, SseEmitter>()

    @Operation(summary = "SSE 연결", description = "SSE 연결")
    @GetMapping(path = ["/subscribe/{userKey}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun subscribe(@PathVariable userKey: String): SseEmitter {
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

    @Operation(summary = "SSE 데이터 전송", description = "SSE 데이터 전송")
    @PostMapping("/publish/{userKey}")
    fun sendData(@PathVariable userKey: String, @RequestBody data: String) {
        val emitter: SseEmitter? = map[userKey]

        emitter?.let {
            val event = SseEmitter.event()
                .name("sse")
                .data(data)
            emitter.send(event)

        }
    }

    private fun createEmitter(): SseEmitter {
        return SseEmitter(Long.MAX_VALUE)
    }
}