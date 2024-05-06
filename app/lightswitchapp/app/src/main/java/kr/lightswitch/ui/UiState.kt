package kr.lightswitch.ui


sealed class UiState {
    object Loading: UiState()
    data class Error(val error: Throwable) : UiState()
    data class Success<T>(val data: T) : UiState()
}