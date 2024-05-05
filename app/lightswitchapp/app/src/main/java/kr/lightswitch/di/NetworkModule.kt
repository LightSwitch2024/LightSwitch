package kr.lightswitch.di

import android.util.Log
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kr.lightswitch.network.LightSwitchService
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit
import javax.inject.Singleton
import kotlinx.serialization.json.Json
import retrofit2.converter.kotlinx.serialization.asConverterFactory

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
//    const val BASE_URL = "http://172.31.16.1:8000/"
//    const val BASE_URL = "https://lightswitch.kr/"
    const val BASE_URL = "http://192.168.0.9:8000/"

    @Provides
    @Singleton
    fun provideOkHttpInterceptor(): HttpLoggingInterceptor {
        val httpLoggingInterceptor = HttpLoggingInterceptor { message ->
            Log.d("okHttp Logger", "message : $message")
        }
        httpLoggingInterceptor.level = HttpLoggingInterceptor.Level.BASIC
        return httpLoggingInterceptor
    }

    @Provides
    @Singleton
    fun providesOkHttpClient(httpLoggingInterceptor: HttpLoggingInterceptor): OkHttpClient =
        OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .addInterceptor(httpLoggingInterceptor)
            .build()



    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .client(okHttpClient)
            .baseUrl(BASE_URL)
            .addConverterFactory(
                Json.asConverterFactory(
                    "application/json; charset=UTF8".toMediaType()))
            .build()
    }

    @Provides
    @Singleton
    fun provideCocktailService(retrofit: Retrofit): LightSwitchService {
        return retrofit.create(LightSwitchService::class.java)
    }

}