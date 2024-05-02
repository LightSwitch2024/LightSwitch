package kr.lightswitch.network

import kotlinx.coroutines.flow.Flow
import kr.lightswitch.model.response.BaseResponse


interface LightSwitchRepository {
    fun getExample(): Flow<BaseResponse<String>>
}