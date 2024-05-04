package kr.lightswitch

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber
import kr.lightswitch.BuildConfig

@HiltAndroidApp
class LightSwitchApplication: Application() {
    override fun onCreate() {
        super.onCreate()
        if (BuildConfig.DEBUG)
            Timber.plant(Timber.DebugTree())

    }
}