package kr.lightswitch.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.mapNotNull
import kotlinx.coroutines.launch
import kr.lightswitch.model.response.Flag
import kr.lightswitch.network.LightSwitchRepository
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val lightSwitchRepository: LightSwitchRepository
): ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            lightSwitchRepository.getExample(
                onStart = {
                    Timber.d("onStart getExample")
                    _uiState.value = UiState.Loading
                },
                onComplete = {
                    Timber.d("onComplete getExample")
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
}