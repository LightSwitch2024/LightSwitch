package com.lightswitch.core.common.dto

class BaseResponse<T>(
    val code: Int,
    val message: String,
    val data: T
)

fun <T> success(data: T): BaseResponse<T> {
    return BaseResponse(ResponseCode.OK.code, ResponseCode.OK.message, data)
}

fun <T> fail(responseCode: ResponseCode, data: T): BaseResponse<T> {
    return BaseResponse(responseCode.code, responseCode.message, data)
}