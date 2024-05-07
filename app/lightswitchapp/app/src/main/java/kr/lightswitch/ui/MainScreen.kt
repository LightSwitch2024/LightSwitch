package kr.lightswitch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import kr.lightswitch.ui.login.LoginPage
import kr.lightswitch.ui.login.LoginViewModel

@Composable
fun MainScreen(
    mainViewModel: MainViewModel,
    navController: NavController
) {
    val isLogin = mainViewModel.isLogin.collectAsStateWithLifecycle().value
    val loginFetchFlag = mainViewModel.loginFetchFlag.collectAsStateWithLifecycle().value

    LaunchedEffect(loginFetchFlag, isLogin) {
        // 앱 실행 시 로그인 상태 확인
        if (loginFetchFlag) {
            if(isLogin) {
                navController.navigate(NavScreen.Flags.route)
            } else {
                navController.navigate(NavScreen.Login.route)
            }
        }
    }
}