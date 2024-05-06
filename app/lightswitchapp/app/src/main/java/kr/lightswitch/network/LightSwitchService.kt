package kr.lightswitch.network

import kr.lightswitch.model.request.LoginRequest
import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag
import kr.lightswitch.model.response.LoginResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path
import retrofit2.http.POST

interface LightSwitchService {
    @GET("api/v1/flag")
    suspend fun exampleRequest(): BaseResponse<List<Flag>>

    @PATCH("api/v1/flag/{flagId}")
    suspend fun switchFlag(@Path("flagId") flagId: Int): BaseResponse<Int>

    @POST("api/v1/member/login")
    suspend fun loginRequest(@Body loginRequest: LoginRequest): BaseResponse<LoginResponse>
}