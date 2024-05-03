package kr.lightswitch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import kr.lightswitch.model.response.Flag

@Composable
fun MainScreen(mainViewModel: MainViewModel,
               onBtnClick: () -> Unit) {
    val flags: List<Flag> by mainViewModel.flagState.collectAsStateWithLifecycle(initialValue = emptyList())
    Column (modifier = Modifier.fillMaxSize()){
        Text(text = flags.toString())
        Button(onClick = onBtnClick) {
            Text(text = "테스트 버튼 입니다. Flag Screen으로 이동합니다.")
        }
    }

}