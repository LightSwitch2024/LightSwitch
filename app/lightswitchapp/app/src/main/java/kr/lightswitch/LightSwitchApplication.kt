package kr.lightswitch

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class LightSwitchApplication: Application() {
    override fun onCreate() {
        super.onCreate()
    }
}