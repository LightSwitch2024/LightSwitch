package kr.lightswitch.network

import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag
import retrofit2.http.GET

interface LightSwitchService {
    @GET("api/v1/flag")
    suspend fun exampleRequest(): BaseResponse<List<Flag>>
}