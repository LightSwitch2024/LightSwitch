package kr.lightswitch.model.response

data class BaseResponse<T>(
    val code: Number,
    val status: String,
    val data: T
)