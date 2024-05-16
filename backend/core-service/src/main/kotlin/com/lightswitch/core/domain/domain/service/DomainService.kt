package com.lightswitch.core.domain.domain.service

import com.lightswitch.core.common.config.CorsConfig
import com.lightswitch.core.domain.domain.repository.DomainRepository
import com.lightswitch.core.domain.domain.repository.entity.Domain
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class DomainService {

    @Autowired
    lateinit var domainRepository: DomainRepository

    @Autowired
    lateinit var corsConfig: CorsConfig

    @Value("\${cors.domain}")
    lateinit var domain: String

    fun addCors(domains: List<String>) {
        val existsDomains = domainRepository.findAll()

        domains.map {
            if (existsDomains.none { existDomain -> existDomain.domain == it }) {
                domainRepository.save(Domain(domain = it))
            }
        }

        corsConfig.updateCorsConfiguration(domains)
    }

    @PostConstruct
    fun initCors() {
        var domains = domainRepository.findAll().map { it.domain }
        if (domains.isEmpty()) {
            domains = listOf(domain)
            domainRepository.saveAll(domains.map { Domain(domain = it) })
        }
        corsConfig.updateCorsConfiguration(domains)
    }

}