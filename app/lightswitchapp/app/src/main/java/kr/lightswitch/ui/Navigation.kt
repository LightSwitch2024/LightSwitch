package kr.lightswitch.ui

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import kr.lightswitch.model.response.Flag
import kr.lightswitch.ui.flag.FlagScreen

@Composable
fun Navigation() {

    val navController = rememberNavController()
//    val mainViewModel: MainViewModel = viewModel()
    NavHost(navController = navController, startDestination = NavScreen.Home.route) {
        composable(
            route = NavScreen.Home.route
        ) {
            val mainViewModel: MainViewModel = hiltViewModel()
            MainScreen(mainViewModel = mainViewModel, onBtnClick = {navController.navigate(NavScreen.Flags.route)})
        }
        composable(
            route = NavScreen.Flags.route,
        ) { backStackEntry ->
            FlagScreen()
        }
        composable(
            route = NavScreen.Login.route,
        ) { backStackEntry ->

        }
    }
}

sealed class NavScreen(val route: String) {

    object Home : NavScreen("Home")

    object Login : NavScreen("Login")

    object Flags : NavScreen("Flags")
}
