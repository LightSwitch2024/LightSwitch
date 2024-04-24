package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.service.FlagService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/flag")
class FlagController(
    @Autowired
    private var flagService: FlagService
) {

    @PostMapping("")
    fun createFlag(@RequestBody flagRequestDto: FlagRequestDto): BaseResponse<FlagResponseDto> {
        return success(flagService.createFlag(flagRequestDto))
    }

    @GetMapping("")
    fun getAllFlagsSummary(): BaseResponse<List<FlagSummaryDto>> {
        return success(flagService.getAllFlag())
    }

    @GetMapping("/{flagId}")
    fun getFlagDetail(@PathVariable flagId: Long): BaseResponse<FlagResponseDto> {
        return success(flagService.getFlag(flagId))
    }
}