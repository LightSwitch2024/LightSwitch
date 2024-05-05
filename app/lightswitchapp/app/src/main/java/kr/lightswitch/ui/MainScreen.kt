package kr.lightswitch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kr.lightswitch.model.response.Flag

@Composable
fun MainScreen(mainViewModel: MainViewModel,
               onBtnClick: () -> Unit) {
    Button(onClick = onBtnClick) {
        Text(text = "테스트 버튼 입니다. Flag Screen으로 이동합니다.")
    }
}