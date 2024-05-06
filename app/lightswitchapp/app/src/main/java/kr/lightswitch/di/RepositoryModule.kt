package kr.lightswitch.di

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kr.lightswitch.network.LightSwitchRepository
import kr.lightswitch.network.LightSwitchRepositoryImpl
import kr.lightswitch.network.LightSwitchService
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
class RepositoryModule {

    @Singleton
    @Provides
    fun provideLightSwitchRepository(
        lightSwitchService: LightSwitchService,
    ): LightSwitchRepository = LightSwitchRepositoryImpl(
        lightSwitchService = lightSwitchService,
    )
}