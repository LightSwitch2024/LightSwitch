package com.lightswitch.core.common.exception

import com.lightswitch.core.common.dto.ResponseCode

class BaseException(private val responseCode: ResponseCode) : RuntimeException(responseCode.message) {
    fun getResponseCode(): ResponseCode {
        return responseCode
    }
}