package com.lightswitch.core.common.exception

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.fail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(BaseException::class)
    fun handleBaseException(e: BaseException): BaseResponse<Nothing?> {
        return fail(e.getResponseCode(), null)
    }
}