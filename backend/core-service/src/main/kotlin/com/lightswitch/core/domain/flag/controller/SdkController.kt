package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.flag.dto.req.FlagInitRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagInitResponseDto
import com.lightswitch.core.domain.flag.service.FlagService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/sdk")
class SdkController(
    @Autowired
    private val flagService: FlagService,
) {

    @PostMapping("/init")
    fun init(@RequestBody flagInitRequestDto: FlagInitRequestDto): BaseResponse<List<FlagInitResponseDto>> {
        return success(flagService.getAllFlagForInit(flagInitRequestDto))
    }
}