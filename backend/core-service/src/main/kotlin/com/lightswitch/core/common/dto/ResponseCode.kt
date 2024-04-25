package com.lightswitch.core.common.dto

import org.springframework.http.HttpStatus

enum class ResponseCode(
    val code: Int,
    val message: String
) {
    // 200 OK
    OK(HttpStatus.OK.value(), "OK"),

    // Sample
    SAMPLE_EXCEPTION(9999, "샘플예외 입니다."),

    // 1000 Flag Exception
    FLAG_NOT_FOUND(1000, "해당하는 Flag가 없습니다."),
    VARIATION_NOT_FOUND(1001, "해당하는 Variation이 없습니다."),

}