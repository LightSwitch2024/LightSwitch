package kr.lightswitch.network

import kotlinx.coroutines.flow.Flow
import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag


interface LightSwitchRepository {
    fun getExample(): Flow<BaseResponse<List<Flag>>>
}