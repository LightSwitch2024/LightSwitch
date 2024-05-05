package kr.lightswitch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
            is UiState.Success -> FlagPage(uiState.data)
        }
    }

//    val flags: List<Flag> by mainViewModel.flagState.collectAsStateWithLifecycle(initialValue = emptyList())
//    Column (modifier = Modifier.fillMaxSize()){
//        Text(text = flags.toString())
//        Button(onClick = onBtnClick) {
//            Text(text = "테스트 버튼 입니다. Flag Screen으로 이동합니다.")
//        }
//    }

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
    Text("Flag 데이터 표시")
}