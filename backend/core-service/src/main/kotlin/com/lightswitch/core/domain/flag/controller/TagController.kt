package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.service.TagService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/tag")
class TagController(
    private val tagService: TagService
) {

    @GetMapping("")
    fun getAllTags(): BaseResponse<List<TagResponseDto>> {
        return success(tagService.getAllTags())
    }

    @GetMapping("/{content}")
    fun getTagsByContent(@PathVariable content: String): BaseResponse<List<TagResponseDto>> {
        return success(tagService.getTagByContent(content))
    }
}