package kr.lightswitch.ui.login

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

@Composable
fun LoginScreen(loginViewModel: LoginViewModel) {

    val loginResponse = loginViewModel.loginState.collectAsStateWithLifecycle().value

    Column(modifier = Modifier.fillMaxSize()) {
        val emailState = remember { mutableStateOf("") }
        val passwordState = remember { mutableStateOf("") }

        OutlinedTextField(
            value = emailState.value,
            onValueChange = { emailState.value = it },
            label = { Text("Email") }
        )

        OutlinedTextField(
            value = passwordState.value,
            onValueChange = { passwordState.value = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation()
        )

        Button(
            onClick = {
                loginViewModel.login(emailState.value, passwordState.value)
            },
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Text(text = "Login")
        }

        // 로그인 응답 데이터가 있으면 표시
        loginResponse?.let {
            Text("ID: ${it.memberId}, 이메일: ${it.email}, 이름: ${it.firstName} ${it.lastName}, 전화번호: ${it.telNumber}")
        }
    }
}