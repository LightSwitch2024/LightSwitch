package com.lightswitch.core.domain.domain.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.domain.dto.req.DomainRequestDto
import com.lightswitch.core.domain.domain.service.DomainService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/domain")
class DomainController {

    @Autowired
    lateinit var domainService: DomainService

    @PostMapping("/cors")
    fun addCors(@RequestBody domainRequestDto: DomainRequestDto): BaseResponse<String> {
        domainService.addCors(domainRequestDto.domains)
        return success("OK")
    }
}