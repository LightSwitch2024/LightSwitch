package com.lightswitch.core.domain.sse.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.sse.dto.SseDto
import com.lightswitch.core.domain.sse.service.SseService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter


@Tag(name = "SSE", description = "SSE 관련 API")
@RestController
@RequestMapping("/v1/sse")
class SseController(
    private val sseService: SseService,
) {

    @Operation(summary = "SSE 연결", description = "SSE 연결")
    @GetMapping(path = ["/subscribe/{userKey}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun subscribe(@PathVariable(name = "userKey") userKey: String): SseEmitter {
        return sseService.subscribe(userKey)
    }

    @Operation(summary = "SSE 데이터 전송", description = "SSE 데이터 전송")
    @PostMapping("/publish")
    fun sendDataExample(@RequestBody sseDto: SseDto) {
        sseService.sendData(sseDto)
    }

    @PostMapping("/subscribe")
    fun createUserKey(sdkKey: String): BaseResponse<String> {
        return success(sseService.createUserKey(sdkKey))
    }
}