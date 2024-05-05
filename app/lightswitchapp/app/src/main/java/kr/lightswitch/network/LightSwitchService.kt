package kr.lightswitch.network

import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path

interface LightSwitchService {
    @GET("api/v1/flag")
    suspend fun exampleRequest(): BaseResponse<List<Flag>>

    @PATCH("api/v1/flag/{flagId}")
    suspend fun switchFlag(@Path("flagId") flagId: Int): BaseResponse<Int>
}