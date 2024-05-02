package kr.lightswitch.network

import kr.lightswitch.model.response.BaseResponse
import retrofit2.http.GET

interface LightSwitchService {
    @GET("api/v1/example")
    suspend fun exampleRequest(): BaseResponse<String>
}