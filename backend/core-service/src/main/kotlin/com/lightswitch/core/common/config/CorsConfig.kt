package com.lightswitch.core.common.config

import com.lightswitch.core.domain.domain.repository.DomainRepository
import jakarta.annotation.PostConstruct
import org.aspectj.lang.annotation.Before
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter


@Configuration
class CorsConfig {

    @Bean
    fun corsFilter(corsConfigurationSource: CorsConfigurationSource): CorsFilter {
        return CorsFilter(corsConfigurationSource)
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        config.allowedHeaders = listOf("*")
        source.registerCorsConfiguration("/**", config)
        return source
    }

    fun updateCorsConfiguration(domains: List<String>) {
        val source = corsConfigurationSource() as UrlBasedCorsConfigurationSource
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        config.allowedHeaders = listOf("*")
        for (domain in domains) {
            config.addAllowedOrigin(domain) // 입력된 도메인 허용
        }
        source.registerCorsConfiguration("/**", config)
    }
}