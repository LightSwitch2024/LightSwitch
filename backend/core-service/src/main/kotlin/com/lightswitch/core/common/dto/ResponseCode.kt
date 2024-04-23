package com.lightswitch.core.common.dto

import org.springframework.http.HttpStatus

enum class ResponseCode(
    val code: Int,
    val message: String
) {
    // 200 OK
    OK(HttpStatus.OK.value(), "OK"),

    // Sample
    SAMPLE_EXCEPTION(9999, "샘플예외 입니다.")
}