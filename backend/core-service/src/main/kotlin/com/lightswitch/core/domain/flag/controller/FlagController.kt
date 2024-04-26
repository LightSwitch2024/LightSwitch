package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.service.FlagService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam

@RestController
@RequestMapping("/v1/flag")
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

    @GetMapping("/filter")
    fun filteredFlags(@RequestParam("tags") tags: List<String>): BaseResponse<List<FlagResponseDto>> {
        return success(flagService.filteredFlags(tags))
    }

    @DeleteMapping("/{flagId}")
    fun deleteFlag(@PathVariable flagId: Long): BaseResponse<Long> {
        return success(flagService.deleteFlag(flagId))
    }

    @PatchMapping("/{flagId}")
    fun switchFlag(@PathVariable flagId: Long): BaseResponse<Long> {
        return success(flagService.switchFlag(flagId))
    }

    @PutMapping("/{flagId}")
    fun updateFlag(@PathVariable flagId: Long, @RequestBody flagRequestDto: FlagRequestDto): BaseResponse<FlagResponseDto> {
        return success(flagService.updateFlag(flagId, flagRequestDto))
    }
}