package kr.lightswitch.network

import kotlinx.coroutines.flow.Flow
import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag


interface LightSwitchRepository {
    fun getExample(onStart: () -> Unit,
                   onComplete: () -> Unit,
                   onError: (cause: Throwable) -> Unit): Flow<BaseResponse<List<Flag>>>
    fun switchFlag(
                   flagId: Int,
                   onStart: () -> Unit,
                   onComplete: () -> Unit,
                   onError: (cause: Throwable) -> Unit): Flow<BaseResponse<Int>>
}