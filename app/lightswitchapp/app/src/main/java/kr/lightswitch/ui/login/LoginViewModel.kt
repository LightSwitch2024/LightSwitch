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

    private val _email = MutableStateFlow("")
    private val _password = MutableStateFlow("")

    private val _loginResponse = MutableStateFlow<LoginResponse?>(null)
    val loginState: StateFlow<LoginResponse?> = _loginResponse

    fun setEmail(email: String) {
        _email.value = email
    }

    fun setPassword(password: String) {
        _password.value = password
    }

    fun startLogin() {
        viewModelScope.launch {
            lightSwitchRepository.login(
                email = _email.value,
                password = _password.value,
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