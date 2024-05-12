package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.service.TagService
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers


@WebMvcTest(TagController::class)
class TagControllerTest(
    @Autowired
    val mockMvc: MockMvc,
) {

    @MockBean
    private lateinit var tagService: TagService

    @Test
    fun `태그 전체 조회 _ getAllTags`() {
        // given
        `when`(tagService.getAllTags()).thenReturn(
            listOf(
                TagResponseDto(
                    colorHex = "#FFFFFF",
                    content = "content1",
                ),
                TagResponseDto(
                    colorHex = "#000000",
                    content = "content2",
                )
            )
        )

        // when
        mockMvc.perform(
            get("/v1/tag")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("200"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("OK"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[0].colorHex").value("#FFFFFF"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[0].content").value("content1"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[1].colorHex").value("#000000"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[1].content").value("content2"))

        // then
        verify(tagService).getAllTags()
    }

    @Test
    fun `content 기반 tag 검색 기능 _ getTagsByContent`() {
        // given
        `when`(tagService.getTagByContent("content")).thenReturn(
            listOf(
                TagResponseDto(
                    colorHex = "#FFFFFF",
                    content = "content1",
                ),
                TagResponseDto(
                    colorHex = "#000000",
                    content = "content2",
                )
            )
        )

        // when
        mockMvc.perform(
            get("/v1/tag/content")
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("200"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("OK"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[0].colorHex").value("#FFFFFF"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[0].content").value("content1"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[1].colorHex").value("#000000"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data.[1].content").value("content2"))

        // then
        verify(tagService).getTagByContent("content")
    }
}