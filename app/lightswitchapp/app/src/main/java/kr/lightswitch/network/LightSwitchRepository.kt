package kr.lightswitch.network

import kotlinx.coroutines.flow.Flow
import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag
import kr.lightswitch.model.response.LoginResponse


interface LightSwitchRepository {
    fun getExample(onStart: () -> Unit,
                   onComplete: () -> Unit,
                   onError: (cause: Throwable) -> Unit): Flow<BaseResponse<List<Flag>>>

    fun login(email: String,
              password: String,
              onStart: () -> Unit,
              onComplete: () -> Unit,
              onError: (cause: Throwable) -> Unit): Flow<BaseResponse<LoginResponse>>
}