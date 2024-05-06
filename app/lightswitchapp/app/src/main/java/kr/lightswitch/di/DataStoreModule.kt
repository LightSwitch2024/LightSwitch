package kr.lightswitch.di

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kr.lightswitch.model.response.LoginResponse

class DataStoreModule(private val context: Context) {

    private object PreferenceKeys {
        val MEMBER_ID = longPreferencesKey("member_id")
        val EMAIL = stringPreferencesKey("email")
        val FIRST_NAME = stringPreferencesKey("first_name")
        val LAST_NAME = stringPreferencesKey("last_name")
        val TEL_NUMBER = stringPreferencesKey("tel_number")
        val LOGIN_CHECK = booleanPreferencesKey("login_check")
    }

    private val Context.loginDataStore by preferencesDataStore(name = LOGIN_DATASTORE)

    suspend fun saveLoginData(
        loginResponse: LoginResponse,
    ) {

        println(" ========================================== ")

        context.loginDataStore.edit { prefs ->
            prefs[PreferenceKeys.MEMBER_ID] = loginResponse.memberId
            prefs[PreferenceKeys.EMAIL] = loginResponse.email
            prefs[PreferenceKeys.FIRST_NAME] = loginResponse.firstName
            prefs[PreferenceKeys.LAST_NAME] = loginResponse.lastName
            prefs[PreferenceKeys.TEL_NUMBER] = loginResponse.telNumber
        }

        context.loginDataStore.edit { prefs ->
            prefs[PreferenceKeys.LOGIN_CHECK] = true
        }
        println ("==========================================")
    }

    val isLogin: Flow<Boolean> = context.loginDataStore.data.map { prefs ->
            prefs[PreferenceKeys.LOGIN_CHECK] ?: false
        }

    companion object {
        private const val LOGIN_DATASTORE = "login_datastore"
        private const val LOGIN_CHECK_DATASTORE = "login_check_datastore"
    }

}