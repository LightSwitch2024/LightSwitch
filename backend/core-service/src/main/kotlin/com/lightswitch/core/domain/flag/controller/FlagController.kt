package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.dto.req.FlagInfoRequestDto
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.req.KeywordInfoRequestDto
import com.lightswitch.core.domain.flag.dto.req.VariationInfoRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.dto.res.MainPageOverviewDto
import com.lightswitch.core.domain.flag.service.FlagService
import com.lightswitch.core.domain.member.service.SdkKeyService
import jakarta.websocket.server.PathParam
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/flag")
class FlagController(
    @Autowired
    private var flagService: FlagService,

    @Autowired
    private var sdkKeyService: SdkKeyService
) {

    @PostMapping("")
    fun createFlag(@RequestBody flagRequestDto: FlagRequestDto): BaseResponse<FlagResponseDto> {
        return success(flagService.createFlag(flagRequestDto))
    }

    @GetMapping("/confirm/{title}")
    fun confirmDuplicateTitle(@PathVariable title: String): BaseResponse<Boolean> {
        return success(flagService.confirmDuplicateTitle(title))
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

    /**
     * flagId에 해당하는 Flag의 variation과 keyword를 Soft Delete
     */
    @DeleteMapping("softdelete/{flagId}")
    fun deleteFlag(@PathVariable flagId: Long): BaseResponse<Long> {
        return success(flagService.deleteFlag(flagId))
    }

    /**
     * flagId에 해당하는 Flag의 variation과 keyword를 Hard Delete
     * 현재 채택하고 있는 구현 방식입니다
     */
    @DeleteMapping("/{flagId}")
    fun deleteFlagWithHardDelete(@PathVariable flagId: Long): BaseResponse<Long> {
        return success(flagService.deleteFlagWithHardDelete(flagId))
    }

    @PatchMapping("/{flagId}")
    fun switchFlag(@PathVariable flagId: Long): BaseResponse<Long> {
        return success(flagService.switchFlag(flagId))
    }

    @PutMapping("/{flagId}")
    fun updateFlag(
        @PathVariable flagId: Long,
        @RequestBody flagRequestDto: FlagRequestDto
    ): BaseResponse<FlagResponseDto> {
        return success(flagService.updateFlag(flagId, flagRequestDto))
    }

    @PatchMapping("/flaginfo/{flagId}")
    fun updateFlagInfo(
        @PathVariable flagId: Long,
        @RequestBody flagInfoRequestDto: FlagInfoRequestDto
    ): BaseResponse<FlagResponseDto> {
        return success(flagService.updateFlagInfo(flagId, flagInfoRequestDto))
    }

    @PatchMapping("/variationinfo/soft/{flagId}")
    fun updateVariationInfo(
        @PathVariable flagId: Long,
        @RequestBody variationInfoRequestDto: VariationInfoRequestDto
    ): BaseResponse<FlagResponseDto> {
        return success(flagService.updateVariationInfo(flagId, variationInfoRequestDto))
    }

    @PatchMapping("/variationinfo/{flagId}")
    fun updateVariationInfoWithHardDelete(
        @PathVariable flagId: Long,
        @RequestBody variationInfoRequestDto: VariationInfoRequestDto
    ): BaseResponse<FlagResponseDto> {
        return success(flagService.updateVariationInfoWithHardDelete(flagId, variationInfoRequestDto))
    }

    @PatchMapping("/keywordinfo/soft/{flagId}")
    fun updateKeywordInfo(
        @PathVariable flagId: Long,
        @RequestBody keywordInfoRequestDto: KeywordInfoRequestDto
    ): BaseResponse<FlagResponseDto> {
        return success(flagService.updateKeywordInfo(flagId, keywordInfoRequestDto))
    }

    @PatchMapping("/keywordinfo/{flagId}")
    fun updateKeywordInfoWithHardDelete(
        @PathVariable flagId: Long,
        @RequestBody keywordInfoRequestDto: KeywordInfoRequestDto
    ): BaseResponse<FlagResponseDto> {
        return success(flagService.updateKeywordInfoWithHardDelete(flagId, keywordInfoRequestDto))
    }

    @GetMapping("/overview")
    fun getFlagOverview(@PathParam(value = "memberId") memberId: Long): BaseResponse<MainPageOverviewDto> {
        val flagCountForOverview = flagService.getFlagCountForOverview()
        val sdkKeyForOverview = sdkKeyService.getSdkKeyForOverview(memberId)

        val totalFlags = flagCountForOverview["totalFlags"] ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
        val activeFlags = flagCountForOverview["activeFlags"] ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
        var sdkKey: String? = ""
        if (sdkKeyForOverview["sdkKey"] != null) {
            sdkKey = sdkKeyForOverview["sdkKey"]
        } else {
            sdkKey = ""
        }

        return success(
            MainPageOverviewDto(
                totalFlags = totalFlags,
                activeFlags = activeFlags,
                sdkKey = sdkKey!!,
            )
        )
    }

    @GetMapping("/keyword/{keyword}")
    fun getFlagsSummaryByKeyword(@PathVariable keyword: String): BaseResponse<List<FlagSummaryDto>> {
        return success(flagService.getFlagsSummaryByKeyword(keyword))
    }
}