//package com.lightswitch.core.common.config
//
//import jakarta.servlet.http.HttpServletRequest
//import org.springframework.context.annotation.Configuration
//import org.springframework.web.cors.CorsConfiguration
//import org.springframework.web.cors.CorsConfigurationSource
//import org.springframework.web.servlet.config.annotation.CorsRegistry
//import org.springframework.web.servlet.config.annotation.EnableWebMvc
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
//
//
//@Configuration
//@EnableWebMvc
//class WebConfig : WebMvcConfigurer {
//    override fun addCorsMappings(registry: CorsRegistry) {
//        registry.addMapping("/**")
//            .allowedOrigins("http://localhost:3333", "http://localhost:5173")
//            .allowedHeaders("*")
//            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//            .exposedHeaders("Authorization")
//            .allowCredentials(true)
//            .maxAge(3000)
//    }
//
//    fun corsConfigurationSource(): CorsConfigurationSource {
//        return CorsConfigurationSource { request: HttpServletRequest ->
//            val config = CorsConfiguration()
//            // 여기서 도메인을 동적으로 가져와서 설정할 수 있음
//            val dynamicOrigins = getDynamicOrigins(request)
//            config.allowedOrigins = dynamicOrigins
//            config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//            config.exposedHeaders = listOf("Authorization")
//            config.allowCredentials = true
//            config.maxAge = 3000L
//            config
//        }
//    }
//
//    // 동적으로 origin을 생성하는 메소드
//    fun getDynamicOrigins(request: HttpServletRequest): List<String> {
//        // 여기서 외부에서 도메인을 입력받아서 처리할 수 있음
//        return listOf("http://localhost:3333", "http://localhost:5173")
//    }
//}