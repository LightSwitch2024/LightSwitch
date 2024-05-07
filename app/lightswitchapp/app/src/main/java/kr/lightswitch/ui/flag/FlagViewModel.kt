package kr.lightswitch.ui.flag

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kr.lightswitch.model.response.Flag
import kr.lightswitch.network.LightSwitchRepository
import kr.lightswitch.ui.UiState
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class FlagViewModel @Inject constructor(
    private val lightSwitchRepository: LightSwitchRepository
): ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState = _uiState.asStateFlow()

    init {
        getFlags()
    }
    private fun getFlags() {
        viewModelScope.launch {
            lightSwitchRepository.getExample(
                onStart = {
                    Timber.d("onStart getFlags")
                    _uiState.value = UiState.Loading
                },
                onComplete = {
                    Timber.d("onComplete getFlags")
                },
                onError = { error ->
                    Timber.d("error occured : $error")
                    _uiState.value = UiState.Error(error)
                }
            ).collectLatest {response ->
                _uiState.value = UiState.Success(response.data)
            }
        }
    }
    fun switchFlag(flag: Flag) {
        viewModelScope.launch {
            lightSwitchRepository.switchFlag(
                flagId = flag.flagId,
                onStart = {
                    Timber.d("onStart switchFlag")
                },
                onComplete = {
                    Timber.d("onComplete switchFlag")
                },
                onError = { error ->
                    Timber.d("error occured : $error")
                    _uiState.value = UiState.Error(error)
                }
            ).collectLatest {response ->
                flag.active = flag.active.not()
            }
        }
    }
}