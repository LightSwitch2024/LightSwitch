package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.req.FlagInitRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagInitResponseDto
import com.lightswitch.core.domain.flag.service.FlagService
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDateTime

@WebMvcTest(SdkController::class)
class SdkControllerTest(
    @Autowired
    val mockMvc: MockMvc,
) {

    @MockBean
    private lateinit var flagService: FlagService

    @Test
    fun `sdl init 테스트 _ init`() {
        // given
        val flagInitRequestDtoEntity = FlagInitRequestDto(
            sdkKey = "sdkKey",
        )
        val flagInitRequestDtoString = "{\"sdkKey\":\"sdkKey\"}"

        `when`(flagService.getAllFlagForInit(flagInitRequestDtoEntity)).thenReturn(
            listOf(
                FlagInitResponseDto(
                    flagId = 1,
                    title = "title",
                    description = "description",
                    type = FlagType.BOOLEAN,
                    keywords = listOf(
                        KeywordDto(
                            value = "TRUE",
                            description = "description",
                            properties = emptyList()
                        )
                    ),
                    variations = emptyList(),
                    defaultValue = "TRUE",
                    defaultDescription = "defaultDescription",
                    defaultPortion = 100,
                    maintainerId = 1,
                    createdAt = LocalDateTime.now().toString(),
                    updatedAt = LocalDateTime.now().toString(),
                    deleteAt = null,
                    active = true,
                )
            )
        )

        // when
        mockMvc.perform(
            post("/v1/sdk/init")
                .contentType(MediaType.APPLICATION_JSON)
                .content(flagInitRequestDtoString)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("200"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("OK"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].flagId").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].title").value("title"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].description").value("description"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].type").value("BOOLEAN"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].keywords[0].value").value("TRUE"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].keywords[0].description").value("description"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].keywords[0].properties").isEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].variations").isEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].defaultValue").value("TRUE"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].defaultDescription").value("defaultDescription"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].defaultPortion").value(100))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].maintainerId").value(1))
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].createdAt").isString)
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].updatedAt").isString)
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].deleteAt").doesNotExist())
            .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].active").value(true))

        // then
        verify(flagService).getAllFlagForInit(flagInitRequestDtoEntity)
    }
}