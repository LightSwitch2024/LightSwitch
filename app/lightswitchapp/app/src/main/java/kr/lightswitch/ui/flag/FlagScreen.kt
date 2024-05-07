package kr.lightswitch.ui.flag

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kr.lightswitch.R
import kr.lightswitch.model.response.Flag
import kr.lightswitch.ui.UiState
import kr.lightswitch.ui.theme.C900
import kr.lightswitch.ui.theme.FlagOffColor
import kr.lightswitch.ui.theme.FlagOnColor
import kr.lightswitch.ui.theme.FlagTextColor
import kr.lightswitch.ui.theme.bgColor
import timber.log.Timber


@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun FlagScreen(flagViewModel: FlagViewModel) {
    Timber.d("flagScreen")
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
            .verticalScroll(scrollState)
            .background(bgColor)) {
        data.forEach {
            var checked by remember { mutableStateOf(it.active) }
            FlagView(flag = it, checked = checked, onCheckedChange = { check ->
                flagViewModel.switchFlag(it)
                checked = check
            })
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun FlagView(flag: Flag, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    var isExpand by remember {
        mutableStateOf(false)
    }
    Card(onClick = {isExpand = isExpand.not()}, modifier = Modifier.padding(12.dp), shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(Modifier.fillMaxSize(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(
                    text = flag.title,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight(800),
                    color = C900
                )
                AssistChip(
                    onClick = {  },
                    label = { Text("${flag.maintainerName}") },
                    leadingIcon = {
                        Icon(
                            Icons.Filled.AccountCircle,
                            contentDescription = "flag maintainer",
                        )
                    }
                )
            }
            if (!isExpand) {
                Row (Modifier.fillMaxSize()){
                    Text(
                        text = flag.description,
                        overflow = TextOverflow.Ellipsis,
                        maxLines = 1,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                Row(Modifier.fillMaxSize(), horizontalArrangement = Arrangement.End) {
                    if (flag.active) {
                        AssistChip(
                            colors = AssistChipDefaults.assistChipColors(FlagOnColor),
                            onClick = {  },
                            label = {
                                Image(
                                    painter = painterResource(id = R.drawable.radio_button_checked),
                                    contentDescription = "image description",
                                    contentScale = ContentScale.None
                                )
                                Text(modifier = Modifier.padding(start = 5.dp), text = "ON", color = FlagTextColor)
                            },
                        )
                    } else {
                        AssistChip(
                            colors = AssistChipDefaults.assistChipColors(FlagOffColor),
                            onClick = {  },
                            label = {
                                Image(
                                    painter = painterResource(id = R.drawable.radio_button_unchecked),
                                    contentDescription = "image description",
                                    contentScale = ContentScale.None
                                )
                                Text(modifier = Modifier.padding(start = 5.dp), text = "OFF", color = FlagTextColor)
                            }
                        )
                    }
                }

            } else {
                Row (Modifier.fillMaxSize()){
                    Text(
                        text = flag.description,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                Row(
                    Modifier
                        .fillMaxSize()
                        .padding(10.dp), horizontalArrangement = Arrangement.End) {
                    Switch(
                        checked = checked,
                        onCheckedChange = onCheckedChange
                    )
                }
            }

        }

    }
}
