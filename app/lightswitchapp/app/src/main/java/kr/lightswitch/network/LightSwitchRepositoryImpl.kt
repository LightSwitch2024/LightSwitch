package kr.lightswitch.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.onCompletion
import kotlinx.coroutines.flow.onStart
import kr.lightswitch.model.request.LoginRequest
import kr.lightswitch.model.request.SwitchRequest
import kr.lightswitch.model.response.BaseResponse
import kr.lightswitch.model.response.Flag
import kr.lightswitch.model.response.LoginResponse
import javax.inject.Inject

class LightSwitchRepositoryImpl @Inject constructor(
    private val lightSwitchService: LightSwitchService,
) : LightSwitchRepository {
    private val ioDispatcher = Dispatchers.IO

    override fun getExample(
        onStart: () -> Unit,
        onComplete: () -> Unit,
        onError: (cause: Throwable) -> Unit
    ): Flow<BaseResponse<List<Flag>>> = flow {
        val response = lightSwitchService.exampleRequest()
        emit(response)
    }.flowOn(ioDispatcher).onStart{ onStart() }.onCompletion { onComplete() }.catch { error -> onError(error) }

    override fun switchFlag(
        flagId: Int,
        switchRequest: SwitchRequest,
        onStart: () -> Unit,
        onComplete: () -> Unit,
        onError: (cause: Throwable) -> Unit
    ): Flow<BaseResponse<Boolean>> = flow {
        val response = lightSwitchService.switchFlag(flagId = flagId, switchRequest = switchRequest)
        emit(response)
}.flowOn(ioDispatcher).onStart{ onStart() }.onCompletion { onComplete() }.catch { error -> onError(error) }
    override fun login(
        email: String,
        password: String,
        onStart: () -> Unit,
        onComplete: () -> Unit,
        onError: (cause: Throwable) -> Unit
    ): Flow<BaseResponse<LoginResponse>> = flow {
        val response = lightSwitchService.loginRequest(loginRequest = LoginRequest(email = email, password = password))
        emit(response)
    }.flowOn(ioDispatcher).onStart{ onStart() }.onCompletion { onComplete() }.catch { error -> onError(error) }
}
