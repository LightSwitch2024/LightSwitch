package com.lightswitch.core.common.config
import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.servers.Server
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.ForwardedHeaderFilter
import org.springframework.beans.factory.annotation.Value

@Configuration
class SwaggerConfig {

    @Value("\${server.servlet.context-path}")
    private val contextPath: String? = null

    @Bean
    fun openAPI(): OpenAPI = OpenAPI()
        .components(Components())
        .info(apiInfo())
        .servers(listOf(serverUrl()))

    private fun apiInfo() = Info()
        .title("Light Switch API Document")
        .description("Light Switch Web Application API 문서입니다.")
        .version("1.0.0")

    private fun serverUrl(): Server {
        val url = if (contextPath.isNullOrBlank()) "/" else contextPath
        return Server().url("$url/api")
    }

    @Bean
    fun forwardedHeaderFilter(): ForwardedHeaderFilter {
        return ForwardedHeaderFilter()
    }
}
