package kr.lightswitch

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber
import kr.lightswitch.BuildConfig
import kr.lightswitch.di.DataStoreModule

@HiltAndroidApp
class LightSwitchApplication: Application() {

    private lateinit var dataStore: DataStoreModule

    companion object {
        private lateinit var lightSwitchApplication: LightSwitchApplication
        fun getInstance() : LightSwitchApplication = lightSwitchApplication
    }

    override fun onCreate() {
        super.onCreate()
        lightSwitchApplication = this
        dataStore = DataStoreModule(this)
        if (BuildConfig.DEBUG)
            Timber.plant(Timber.DebugTree())
    }

    fun getDataStore(): DataStoreModule {
        return dataStore
    }
}