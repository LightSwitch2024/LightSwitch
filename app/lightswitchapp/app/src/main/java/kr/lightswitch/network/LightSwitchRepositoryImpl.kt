package kr.lightswitch.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag
import javax.inject.Inject

class LightSwitchRepositoryImpl @Inject constructor(
    private val lightSwitchService: LightSwitchService
) : LightSwitchRepository {
    private val ioDispatcher = Dispatchers.IO

    override fun getExample(): Flow<BaseResponse<List<Flag>>> = flow {
        val response = lightSwitchService.exampleRequest()
        emit(response)
    }.flowOn(ioDispatcher)

}
