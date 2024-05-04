package kr.lightswitch.ui

import androidx.lifecycle.ViewModel
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
import kr.lightswitch.model.response.Flag
import kr.lightswitch.network.LightSwitchRepository
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val lightSwitchRepository: LightSwitchRepository
): ViewModel() {

    @OptIn(ExperimentalCoroutinesApi::class)
    val flagState: Flow<List<Flag>> = lightSwitchRepository.getExample(
        onStart = {
            Timber.d("onStart getExample")
        },
        onComplete = {
            Timber.d("onComplete getExample")
        },
        onError = {
            error ->
            Timber.d("error occured : $error")
        }
    )
        .mapNotNull { it.data }
}