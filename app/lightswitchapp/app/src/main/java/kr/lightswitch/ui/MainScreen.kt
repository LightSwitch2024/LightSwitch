package kr.lightswitch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kr.lightswitch.model.response.Flag

@Composable
fun MainScreen(mainViewModel: MainViewModel,
               onBtnClick: () -> Unit) {
    val uiState = mainViewModel.uiState.collectAsStateWithLifecycle().value

    Column (modifier = Modifier.fillMaxSize()){
        when(uiState) {
            is UiState.Loading -> LoadingPage()
            is UiState.Error -> ErrorPage(error = uiState.error)
            is UiState.Success<*> -> FlagPage(uiState.data as List<Flag>)
        }
    }
}

@Composable
fun ErrorPage(error: Throwable) {
    Text("오류가 발생 했습니다. $error.message")
}

@Composable
fun LoadingPage() {
    Text("로딩 페이지 표시")
}
@Composable
fun FlagPage(data: List<Flag>) {
    Text(data.toString())
}