package kr.lightswitch.ui

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kr.lightswitch.network.LightSwitchRepository
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val lightSwitchRepository: LightSwitchRepository
): ViewModel() {
    private val _text = MutableStateFlow("")
    val text = _text.asStateFlow()

}