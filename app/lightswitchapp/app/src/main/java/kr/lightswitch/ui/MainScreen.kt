package kr.lightswitch.ui

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kr.lightswitch.model.response.Flag

@Composable
fun MainScreen(mainViewModel: MainViewModel = viewModel()) {
    val flags: List<Flag> by mainViewModel.flagState.collectAsStateWithLifecycle(initialValue = emptyList())
    Text(text = flags.toString())
}
