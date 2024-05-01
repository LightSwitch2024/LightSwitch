package com.lightswitch.core.domain.sse.dto

data class SseDto(
    val userKey: String,
    val type: SseType,
    val data: Any,
) {
    enum class SseType(val type: String) {
        CREATE("create"),
        DELETE("delete"),
        UPDATE("update"),
        SWITCH("switch"),
    }
}