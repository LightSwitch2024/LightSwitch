package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.service.FlagService
import com.lightswitch.core.domain.member.service.SdkKeyService
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDateTime

@WebMvcTest(FlagController::class)
class FlagControllerTest(
    @Autowired
    val mockMvc: MockMvc
) {

    @MockBean
    private lateinit var flagService: FlagService

    @MockBean
    private lateinit var sdkKeyService: SdkKeyService

    @Test
    fun `FlagControllerTest 빈 생성 확인 테스트`() {
        println("mockMvc = $mockMvc")
    }

    @Test
    fun `플래그 생성 테스트 _ createFlag`() {
        // given
        val flagReqDtoString =
            "{\"title\":\"테스트 플래그\",\"description\":\"테스트 플래그 설명\",\"tags\":[],\"type\":\"STRING\",\"keywords\":[],\"defaultValue\":\"A\",\"defaultPortion\":50,\"defaultDescription\":\"TEST\",\"variations\":[],\"memberId\":188}"
        val flagReqDtoEntity = FlagRequestDto(
            title = "테스트 플래그",
            description = "테스트 플래그 설명",
            tags = emptyList(),
            type = FlagType.STRING,
            keywords = emptyList(),
            defaultValue = "A",
            defaultPortion = 50,
            defaultDescription = "TEST",
            variations = emptyList(),
            memberId = 188
        )

        `when`(flagService.createFlag(flagReqDtoEntity)).thenReturn(
            FlagResponseDto(
                flagId = 1,
                title = "테스트 플래그",
                description = "테스트 플래그 설명",
                tags = emptyList(),
                type = FlagType.STRING,
                keywords = emptyList(),
                defaultValue = "A",
                defaultPortion = 50,
                defaultDescription = "TEST",
                variations = emptyList(),
                memberId = 188,

                createdAt = LocalDateTime.now().toString(),
                updatedAt = LocalDateTime.now().toString(),
                active = false,
            )
        )

        // when
        mockMvc.perform(
            post("/v1/flag")
                .contentType(MediaType.APPLICATION_JSON)
                .content(flagReqDtoString)
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data.flagId").value(1))
            .andExpect(jsonPath("$.data.title").value("테스트 플래그"))
            .andExpect(jsonPath("$.data.description").value("테스트 플래그 설명"))
            .andExpect(jsonPath("$.data.tags").isEmpty)
            .andExpect(jsonPath("$.data.type").value("STRING"))
            .andExpect(jsonPath("$.data.keywords").isEmpty)
            .andExpect(jsonPath("$.data.defaultValue").value("A"))
            .andExpect(jsonPath("$.data.defaultPortion").value(50))
            .andExpect(jsonPath("$.data.defaultDescription").value("TEST"))
            .andExpect(jsonPath("$.data.memberId").value(188))
            .andExpect(jsonPath("$.data.active").value(false))

        // then
        verify(flagService).createFlag(flagReqDtoEntity)


    }

    @Test
    fun `플래그 중복 타이틀 검사 api 테스트 _ confirmDuplicateTitle`() {
        // given
        `when`(flagService.confirmDuplicateTitle("타이틀 중복 검사 테스트")).thenReturn(false)
        `when`(flagService.confirmDuplicateTitle("타이틀 중복 검사 테스트2")).thenReturn(true)

        // when
        mockMvc.perform(
            get("/v1/flag/confirm/타이틀 중복 검사 테스트")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data").value(false))

        mockMvc.perform(
            get("/v1/flag/confirm/타이틀 중복 검사 테스트2")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data").value(true))

        // then
        verify(flagService).confirmDuplicateTitle("타이틀 중복 검사 테스트")
        verify(flagService).confirmDuplicateTitle("타이틀 중복 검사 테스트2")
    }

    @Test
    fun `플래그 리스트 조회_ getAllFlagsSummary`() {
        // given
        `when`(flagService.getAllFlag()).thenReturn(
            listOf(
                FlagSummaryDto(
                    flagId = 1,
                    title = "테스트 플래그1",
                    description = "테스트 플래그 설명1",
                    tags = emptyList(),
                    active = false,
                    maintainerName = "테스트 유저1",
                ),
                FlagSummaryDto(
                    flagId = 2,
                    title = "테스트 플래그2",
                    description = "테스트 플래그 설명2",
                    tags = emptyList(),
                    active = false,
                    maintainerName = "테스트 유저2",
                ),
                FlagSummaryDto(
                    flagId = 3,
                    title = "테스트 플래그3",
                    description = "테스트 플래그 설명3",
                    tags = emptyList(),
                    active = false,
                    maintainerName = "테스트 유저3",
                ),
            )
        )

        // when
        mockMvc.perform(
            get("/v1/flag")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data[0].flagId").value(1))
            .andExpect(jsonPath("$.data[0].title").value("테스트 플래그1"))
            .andExpect(jsonPath("$.data[0].description").value("테스트 플래그 설명1"))
            .andExpect(jsonPath("$.data[0].tags").isEmpty)
            .andExpect(jsonPath("$.data[0].active").value(false))
            .andExpect(jsonPath("$.data[0].maintainerName").value("테스트 유저1"))

            .andExpect(jsonPath("$.data[1].flagId").value(2))
            .andExpect(jsonPath("$.data[1].title").value("테스트 플래그2"))
            .andExpect(jsonPath("$.data[1].description").value("테스트 플래그 설명2"))
            .andExpect(jsonPath("$.data[1].tags").isEmpty)
            .andExpect(jsonPath("$.data[1].active").value(false))
            .andExpect(jsonPath("$.data[1].maintainerName").value("테스트 유저2"))

            .andExpect(jsonPath("$.data[2].flagId").value(3))
            .andExpect(jsonPath("$.data[2].title").value("테스트 플래그3"))
            .andExpect(jsonPath("$.data[2].description").value("테스트 플래그 설명3"))
            .andExpect(jsonPath("$.data[2].tags").isEmpty)
            .andExpect(jsonPath("$.data[2].active").value(false))
            .andExpect(jsonPath("$.data[2].maintainerName").value("테스트 유저3"))

        // then
        verify(flagService).getAllFlag()
    }

    @Test
    fun `플래그 상세 조회 _ getFlagDetail`() {
        // given
        `when`(flagService.getFlag(1)).thenReturn(
            FlagResponseDto(
                flagId = 1,
                title = "테스트 플래그",
                description = "테스트 플래그 설명",
                tags = emptyList(),
                type = FlagType.STRING,
                keywords = emptyList(),
                defaultValue = "A",
                defaultPortion = 50,
                defaultDescription = "TEST",
                variations = emptyList(),
                memberId = 188,

                createdAt = LocalDateTime.now().toString(),
                updatedAt = LocalDateTime.now().toString(),
                active = false,
            )
        )

        // when
        mockMvc.perform(
            get("/v1/flag/1")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data.flagId").value(1))
            .andExpect(jsonPath("$.data.title").value("테스트 플래그"))
            .andExpect(jsonPath("$.data.description").value("테스트 플래그 설명"))
            .andExpect(jsonPath("$.data.tags").isEmpty)
            .andExpect(jsonPath("$.data.type").value("STRING"))
            .andExpect(jsonPath("$.data.keywords").isEmpty)
            .andExpect(jsonPath("$.data.defaultValue").value("A"))
            .andExpect(jsonPath("$.data.defaultPortion").value(50))
            .andExpect(jsonPath("$.data.defaultDescription").value("TEST"))
            .andExpect(jsonPath("$.data.memberId").value(188))
            .andExpect(jsonPath("$.data.active").value(false))

        // then
        verify(flagService).getFlag(1)
    }
}