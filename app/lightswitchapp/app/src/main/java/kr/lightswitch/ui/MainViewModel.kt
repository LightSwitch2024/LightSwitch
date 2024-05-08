package kr.lightswitch.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.mapNotNull
import kotlinx.coroutines.launch
import kr.lightswitch.LightSwitchApplication
import kr.lightswitch.model.response.Flag
import kr.lightswitch.model.response.LoginResponse
import kr.lightswitch.network.LightSwitchRepository
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
open class MainViewModel @Inject constructor(
) : ViewModel() {

    private val _isLogin = MutableStateFlow<Boolean>(false)
    private val _loginFetchFlag = MutableStateFlow<Boolean>(false)
    val isLogin: StateFlow<Boolean> = _isLogin
    val loginFetchFlag: StateFlow<Boolean> = _loginFetchFlag

    init {
        MainScope().launch {
            LightSwitchApplication.getInstance().getDataStore().isLogin.collect {
                _isLogin.value = it
                _loginFetchFlag.value = true
            }
        }
    }

    open suspend fun login(loginResponse: LoginResponse) {
        LightSwitchApplication.getInstance().getDataStore().saveLoginData(loginResponse)
    }

    open fun logout() {
        viewModelScope.launch {
            LightSwitchApplication.getInstance().getDataStore().removeLoginData()
        }
        _isLogin.value = false
    }

}