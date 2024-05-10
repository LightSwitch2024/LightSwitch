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
    INVALID_FLAG_VALUE(1002, "Flag의 값이 올바르지 않습니다."),

    // 2000 Member Exception
    MEMBER_NOT_FOUND(2000, "해당하는 Member가 없습니다."),

    // 3000 SdkKey Exception
    SDK_KEY_ALREADY_EXISTS(3000, "이미 등록된 SDK Key가 존재합니다."),
    SDK_KEY_NOT_FOUND(3001, "해당하는 SDK Key가 없습니다."),

    // 4000 Authentication Exception
    INVALID_PASSWORD(4000, "비밀번호가 올바르지 않습니다."),

    // 5000 Organization Exception
    ORGANIZATION_ALREADY_EXISTS(5000, "이미 등록된 Organization이 존재합니다."),
    INVALID_ORGANIZATION_KEY(5001, "Organization이 sdk key가 다릅니다"),
    ORGANIZATION_NOT_FOUND(5002, "해당하는 Organization이 없습니다."),
}