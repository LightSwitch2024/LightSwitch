package kr.lightswitch.ui.flag

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardColors
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kr.lightswitch.R
import kr.lightswitch.model.response.Flag
import kr.lightswitch.ui.UiState

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun FlagScreen(flagViewModel: FlagViewModel) {
    val uiState = flagViewModel.uiState.collectAsStateWithLifecycle().value

    Column (modifier = Modifier.fillMaxSize()){
        when(uiState) {
            is UiState.Loading -> LoadingPage()
            is UiState.Error -> ErrorPage(error = uiState.error)
            is UiState.Success<*> -> FlagPage(uiState.data as List<Flag>, flagViewModel = flagViewModel)
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

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun FlagPage(data: List<Flag>, flagViewModel: FlagViewModel) {
    val scrollState = rememberScrollState()
    Column(
        Modifier
            .fillMaxSize()
            .padding(12.dp)
            .verticalScroll(scrollState)) {
        data.forEach {
            var checked by remember { mutableStateOf(it.active) }
            FlagView(flag = it, checked = checked, onCheckedChange = { check ->
                flagViewModel.switchFlag(it)
                checked = check
            })
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun FlagView(flag: Flag, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {

    Card(modifier = Modifier.padding(12.dp), shape = RoundedCornerShape(20.dp)) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(Modifier.fillMaxSize()) {
                Text(
                    text = flag.title,
                    style = TextStyle()
                )
            }
            Row (Modifier.fillMaxSize()){
                Text(
                    text = flag.description
                )
            }
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange
            )
        }

    }
}
