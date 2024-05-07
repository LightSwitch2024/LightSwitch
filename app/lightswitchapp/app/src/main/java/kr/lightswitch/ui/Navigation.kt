package kr.lightswitch.ui

import android.app.Activity
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.BackHandler
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.StateFlow
import kr.lightswitch.ui.flag.FlagScreen
import kr.lightswitch.ui.flag.FlagViewModel
import kr.lightswitch.ui.theme.pretendard
import timber.log.Timber
import kr.lightswitch.ui.login.LoginScreen
import kr.lightswitch.ui.login.LoginViewModel

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Navigation() {
    val navController = rememberNavController()
    val (navTitleState, setNavTitleState) = remember {
        mutableStateOf("")
    }

    val mainViewModel: MainViewModel = hiltViewModel()
    val isLogin = mainViewModel.isLogin.collectAsStateWithLifecycle().value
    val loginFetchFlag = mainViewModel.loginFetchFlag.collectAsStateWithLifecycle().value

    LaunchedEffect(loginFetchFlag, isLogin) {
        if (loginFetchFlag) {
            navController.popBackStack()
            if(isLogin) {
                navController.navigate(NavScreen.Flags.route)
            } else {
                navController.navigate(NavScreen.Login.route)
            }
        }
    }

    navController.addOnDestinationChangedListener { // 라우팅 발생 시 마다 호출되도록
            _, destination, _ ->
        when (destination.route) {
            NavScreen.Login.route -> {
                Timber.d("login")
                setNavTitleState("로그인")
            }

            NavScreen.Flags.route -> {
                Timber.d("flags")
                setNavTitleState("플래그 관리")
            }

            NavScreen.Main.route -> {
                Timber.d("Main")
                setNavTitleState("")
            }
        }
    }

    BackOnPressed()
    Scaffold(topBar = {
        CenterAlignedTopAppBar(title = {
            Text(
                text = navTitleState,
                style = MaterialTheme.typography.titleLarge
            )
        })
    }) {
        Column(modifier = Modifier.padding(it)) {
            NavHost(navController = navController, startDestination = NavScreen.Main.route) {
                composable(
                    route = NavScreen.Main.route,
                ) {
                    MainScreen(
                    )
                }

                composable(
                    route = NavScreen.Login.route,
                ) { backStackEntry ->
                    val loginViewModel: LoginViewModel = hiltViewModel()
                    LoginScreen(
                        loginViewModel = loginViewModel,
                    )
                }
                composable(
                    route = NavScreen.Flags.route,
                ) { backStackEntry ->
                    val flagViewModel: FlagViewModel = hiltViewModel()
                    val loginViewModel: LoginViewModel = hiltViewModel()
                    FlagScreen(
                        flagViewModel = flagViewModel,
                        loginViewModel = loginViewModel,
                        navController = navController
                    )
                }
            }
        }
    }

}

@Composable
fun BackOnPressed() {
    val context = LocalContext.current
    var backPressedState by remember { mutableStateOf(true) }
    var backPressedTime = 0L
    BackHandler(enabled = backPressedState) {
        if (System.currentTimeMillis() - backPressedTime <= 400L) {
            // 앱 종료
            (context as Activity).finish()
        } else {
            backPressedState = true
            Toast.makeText(context, "한 번 더 누르시면 앱이 종료됩니다.", Toast.LENGTH_SHORT).show()
        }
        backPressedTime = System.currentTimeMillis()
    }

}

sealed class NavScreen(val route: String) {

    object Login : NavScreen("Login")

    object Flags : NavScreen("Flags")

    object Main : NavScreen("Main")
}
