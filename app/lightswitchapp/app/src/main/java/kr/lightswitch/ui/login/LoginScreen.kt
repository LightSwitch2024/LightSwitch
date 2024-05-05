package kr.lightswitch.ui.login

import android.widget.Toast
import androidx.annotation.ColorRes
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.contentColorFor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.autoSaver
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import kr.lightswitch.LightSwitchApplication
import kr.lightswitch.R
import kr.lightswitch.ui.NavScreen

@Composable
fun LoginScreen(
    loginViewModel: LoginViewModel,
    navController: NavController
) {

    val loginResponse = loginViewModel.loginState.collectAsStateWithLifecycle().value

    LaunchedEffect(loginResponse) {
        // 앱 실행 시 로그인 상태 확인
        LightSwitchApplication.getInstance().getDataStore().isLogin.collect {
            if(it) {
                println("로그인 상태 확인됨")
                navController.navigate(NavScreen.Flags.route)
            } else {
                println("로그인 상태 확인되지 않음")
            }
        }
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        val emailState = remember { mutableStateOf("") }
        val passwordState = remember { mutableStateOf("") }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp),
            contentAlignment = Alignment.Center,
            content = {
                Image(
                    painter = painterResource(id = R.drawable.lightswitch_logo),
                    contentDescription = "LightSwitch Logo",
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight()
                        .padding(start = 32.dp, end = 32.dp)
                )
            }
        )


        OutlinedTextField(
            value = emailState.value,
            onValueChange = { emailState.value = it },
            label = { Text("이메일") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 32.dp, end = 32.dp)
        )

        OutlinedTextField(
            value = passwordState.value,
            onValueChange = { passwordState.value = it },
            label = { Text("비밀번호") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp, start = 32.dp, end = 32.dp)
        )

        Button(
            onClick = {
                loginViewModel.login(emailState.value, passwordState.value)
            },
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF00C9EA),
                contentColor = Color.White,
                disabledContainerColor = Color.Gray,
                disabledContentColor = Color.White,
            ),
            shape = MaterialTheme.shapes.small,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp, start = 32.dp, end = 32.dp),
            content = {
                Text(text = "로그인")
            }
        )

        // 로그인 응답 데이터가 있으면 표시
        loginResponse?.let {
            navController.navigate(NavScreen.Flags.route)
        }
    }
}