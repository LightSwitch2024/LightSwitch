package kr.lightswitch.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kr.lightswitch.model.response.LoginResponse
import kr.lightswitch.network.LightSwitchRepository
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val lightSwitchRepository: LightSwitchRepository
) : ViewModel() {

    private val _loginResponse = MutableStateFlow<LoginResponse?>(null)
    val loginState: StateFlow<LoginResponse?> = _loginResponse

    fun login(email: String, password: String) {
        viewModelScope.launch {
            lightSwitchRepository.login(
                email = email,
                password = password,
                onStart = {
                    Timber.d("onStart login")
                },
                onComplete = {
                    Timber.d("onComplete login")
                },
                onError = { error ->
                    Timber.d("error occured : $error")
                }
            ).collect {
                _loginResponse.value = it.data
            }
        }
    }
}