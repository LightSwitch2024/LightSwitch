package kr.lightswitch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun MainScreen(mainViewModel: MainViewModel,
               onBtnClick: () -> Unit,
               onLoginBtnClick: () -> Unit) {
    Column (modifier = Modifier.fillMaxSize()){
        Button(onClick = onBtnClick) {
            Text(text = "테스트 버튼 입니다. Flag Screen으로 이동합니다.")
        }
        Button(onClick = onLoginBtnClick) {
            Text(text = "테스트 버튼2 입니다. Login Screen으로 이동합니다.")
        }
    }
}