package com.lightswitch.core.domain.flag.controller

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.*
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDateTime

@WebMvcTest(FlagController::class)
class FlagControllerTest(
    @Autowired val mockMvc: MockMvc
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
            "{\"title\":\"테스트 플래그\",\"description\":\"테스트 플래그 설명\",\"tags\":[],\"type\":\"STRING\"," +
                    "\"keywords\":[],\"defaultValue\":\"A\",\"defaultPortion\":50,\"defaultDescription\":\"TEST\"," +
                    "\"variations\":[],\"memberId\":188}"
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
            post("/v1/flag").contentType(MediaType.APPLICATION_JSON).content(flagReqDtoString)
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("200"))
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
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK")).andExpect(jsonPath("$.data").value(false))

        mockMvc.perform(
            get("/v1/flag/confirm/타이틀 중복 검사 테스트2")
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK")).andExpect(jsonPath("$.data").value(true))

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
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK")).andExpect(jsonPath("$.data[0].flagId").value(1))
            .andExpect(jsonPath("$.data[0].title").value("테스트 플래그1"))
            .andExpect(jsonPath("$.data[0].description").value("테스트 플래그 설명1"))
            .andExpect(jsonPath("$.data[0].tags").isEmpty).andExpect(jsonPath("$.data[0].active").value(false))
            .andExpect(jsonPath("$.data[0].maintainerName").value("테스트 유저1"))

            .andExpect(jsonPath("$.data[1].flagId").value(2)).andExpect(jsonPath("$.data[1].title").value("테스트 플래그2"))
            .andExpect(jsonPath("$.data[1].description").value("테스트 플래그 설명2"))
            .andExpect(jsonPath("$.data[1].tags").isEmpty).andExpect(jsonPath("$.data[1].active").value(false))
            .andExpect(jsonPath("$.data[1].maintainerName").value("테스트 유저2"))

            .andExpect(jsonPath("$.data[2].flagId").value(3)).andExpect(jsonPath("$.data[2].title").value("테스트 플래그3"))
            .andExpect(jsonPath("$.data[2].description").value("테스트 플래그 설명3"))
            .andExpect(jsonPath("$.data[2].tags").isEmpty).andExpect(jsonPath("$.data[2].active").value(false))
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
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK")).andExpect(jsonPath("$.data.flagId").value(1))
            .andExpect(jsonPath("$.data.title").value("테스트 플래그"))
            .andExpect(jsonPath("$.data.description").value("테스트 플래그 설명")).andExpect(jsonPath("$.data.tags").isEmpty)
            .andExpect(jsonPath("$.data.type").value("STRING")).andExpect(jsonPath("$.data.keywords").isEmpty)
            .andExpect(jsonPath("$.data.defaultValue").value("A"))
            .andExpect(jsonPath("$.data.defaultPortion").value(50))
            .andExpect(jsonPath("$.data.defaultDescription").value("TEST"))
            .andExpect(jsonPath("$.data.memberId").value(188)).andExpect(jsonPath("$.data.active").value(false))

        // then
        verify(flagService).getFlag(1)
    }

    @Test
    fun `플래그 태그 필터링 검색 _ filteredFlags`() {
        // given
        `when`(flagService.filteredFlags(listOf("tag1", "tag2"))).thenReturn(
            listOf(
                FlagResponseDto(
                    flagId = 1,
                    title = "테스트 플래그1",
                    description = "테스트 플래그 설명1",
                    tags = listOf(
                        TagResponseDto(
                            colorHex = "#FFFFFF", content = "tag1-1"
                        ),
                        TagResponseDto(
                            colorHex = "#FFFFFF", content = "tag1-2"
                        ),
                    ),
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
                ),
                FlagResponseDto(
                    flagId = 2,
                    title = "테스트 플래그2",
                    description = "테스트 플래그 설명2",
                    tags = listOf(
                        TagResponseDto(
                            colorHex = "#FFFFFF", content = "tag2-1"
                        ),
                        TagResponseDto(
                            colorHex = "#FFFFFF", content = "tag2-2"
                        ),
                    ),
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
                ),
            )
        )

        // when
        mockMvc.perform(
            get("/v1/flag/filter?tags=tag1,tag2")
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK")).andExpect(jsonPath("$.data[0].flagId").value(1))
            .andExpect(jsonPath("$.data[0].title").value("테스트 플래그1"))
            .andExpect(jsonPath("$.data[0].description").value("테스트 플래그 설명1"))
            .andExpect(jsonPath("$.data[0].tags[0].content").value("tag1-1"))
            .andExpect(jsonPath("$.data[0].tags[1].content").value("tag1-2"))
            .andExpect(jsonPath("$.data[0].type").value("STRING")).andExpect(jsonPath("$.data[0].keywords").isEmpty)
            .andExpect(jsonPath("$.data[0].defaultValue").value("A"))
            .andExpect(jsonPath("$.data[0].defaultPortion").value(50))
            .andExpect(jsonPath("$.data[0].defaultDescription").value("TEST"))
            .andExpect(jsonPath("$.data[0].memberId").value(188)).andExpect(jsonPath("$.data[0].active").value(false))

            .andExpect(jsonPath("$.data[1].flagId").value(2)).andExpect(jsonPath("$.data[1].title").value("테스트 플래그2"))
            .andExpect(jsonPath("$.data[1].description").value("테스트 플래그 설명2"))
            .andExpect(jsonPath("$.data[1].tags[0].content").value("tag2-1"))
            .andExpect(jsonPath("$.data[1].tags[1].content").value("tag2-2"))
            .andExpect(jsonPath("$.data[1].type").value("STRING")).andExpect(jsonPath("$.data[1].keywords").isEmpty)
            .andExpect(jsonPath("$.data[1].defaultValue").value("A"))
            .andExpect(jsonPath("$.data[1].defaultPortion").value(50))
            .andExpect(jsonPath("$.data[1].defaultDescription").value("TEST"))
            .andExpect(jsonPath("$.data[1].memberId").value(188)).andExpect(jsonPath("$.data[1].active").value(false))

        // then
        verify(flagService).filteredFlags(listOf("tag1", "tag2"))
    }

    @Test
    fun `플래그 삭제 _ deleteFlag`() {
        // given
        `when`(flagService.deleteFlag(1)).thenReturn(1)

        // when
        mockMvc.perform(
            delete("/v1/flag/softdelete/{flagId}", 1)
        ).andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data").value(1))

        // then
        verify(flagService).deleteFlag(1)
    }

    @Test
    fun `플래그 하드 딜리트 _ deleteFlagWithHardDelete`() {
        // given
        `when`(flagService.deleteFlagWithHardDelete(1)).thenReturn(1)

        // when
        mockMvc.perform(
            delete("/v1/flag/1")
        ).andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data").value(1))

        // then
        verify(flagService).deleteFlagWithHardDelete(1)
    }

    @Test
    fun `플래그 active 변경 _ switchFlag`() {
        // given
        `when`(
            flagService.switchFlag(
                1,
                SwitchRequestDto(
                    active = true
                )
            )
        ).thenReturn(false)

        // when
        mockMvc.perform(
            patch("/v1/flag/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"active\":true}")
        ).andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data").value(false))
    }

    @Test
    fun `플래그 기본 정보 수정 _ updateFlagInfo`() {
        // given
        val flagInfoReqDtoString =
            "{\"title\":\"테스트 플래그\",\"description\":\"테스트 플래그 설명\",\"tags\":[]}"
        val flagInfoReqDtoEntity = FlagInfoRequestDto(
            title = "테스트 플래그",
            description = "테스트 플래그 설명",
            tags = listOf(),
        )

        `when`(flagService.updateFlagInfo(1, flagInfoReqDtoEntity)).thenReturn(
            FlagResponseDto(
                flagId = 1,
                title = "테스트 플래그",
                description = "테스트 플래그 설명",
                tags = emptyList(),
                type = FlagType.STRING,
                keywords = emptyList(),
                defaultValue = "A",
                defaultPortion = 100,
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
            patch("/v1/flag/flaginfo/1")
                .contentType(
                    MediaType.parseMediaType("application/json")
                ).content(flagInfoReqDtoString)
        ).andExpect(status().isOk)
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
        verify(flagService).updateFlagInfo(1, flagInfoReqDtoEntity)

    }

    @Test
    fun `플래그 변수 정보 수정 _ updateVariationInfoWithHardDelete`() {
        // given
        val variationInfoReqDtoString =
            "{\"type\":\"STRING\",\"defaultValue\":\"A\",\"defaultPortion\":50,\"defaultDescription\":\"TEST\"," +
                    "\"variations\":[{\"value\":\"B\",\"portion\":50,\"description\":\"TEST\"}]}"
        val variationInfoReqDtoEntity = VariationInfoRequestDto(
            type = FlagType.STRING,
            defaultValue = "A",
            defaultPortion = 50,
            defaultDescription = "TEST",
            variations = listOf(
                VariationDto(
                    value = "B",
                    portion = 50,
                    description = "TEST"
                )
            )
        )

        `when`(flagService.updateVariationInfoWithHardDelete(1, variationInfoReqDtoEntity)).thenReturn(
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
            patch("/v1/flag/variationinfo/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(variationInfoReqDtoString)
        ).andExpect(status().isOk)
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
        verify(flagService).updateVariationInfoWithHardDelete(1, variationInfoReqDtoEntity)
    }

    @Test
    fun `플래그 키워드 정보 수정 _ updateKeywordInfoWithHardDelete`() {
        // given
        val keywordInfoReqDtoString =
            "{\"keywords\":[{\"value\":\"keyword1\",\"description\":\"\",\"properties\":[]},{\"value\":\"keyword2\"," +
                    "\"description\":\"\",\"properties\":[]}]}"
        val keywordInfoReqDtoEntity = KeywordInfoRequestDto(
            keywords = listOf(
                KeywordDto(
                    value = "keyword1",
                    description = "",
                    properties = emptyList()
                ),
                KeywordDto(
                    value = "keyword2",
                    description = "",
                    properties = emptyList()
                )
            )
        )

        `when`(flagService.updateKeywordInfoWithHardDelete(1, keywordInfoReqDtoEntity)).thenReturn(
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
            patch("/v1/flag/keywordinfo/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(keywordInfoReqDtoString)
        ).andExpect(status().isOk)
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
        verify(flagService).updateKeywordInfoWithHardDelete(1, keywordInfoReqDtoEntity)
    }

    @Test
    fun `메인페이지 개요 조회 _ getFlagOverview`() {
        // given
        `when`(flagService.getFlagCountForOverview()).thenReturn(
            mapOf(
                "totalFlags" to 10,
                "activeFlags" to 5
            )
        )

        `when`(sdkKeyService.getSdkKeyForOverview(1)).thenReturn(
            mapOf(
                "sdkKey" to "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            )
        )


        // when
        mockMvc.perform(
            get("/v1/flag/overview?memberId=1")
        ).andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value("200"))
            .andExpect(jsonPath("$.message").value("OK"))
            .andExpect(jsonPath("$.data.totalFlags").value(10))
            .andExpect(jsonPath("$.data.activeFlags").value(5))
            .andExpect(jsonPath("$.data.sdkKey").value("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))

        // then
        verify(flagService).getFlagCountForOverview()
        verify(sdkKeyService).getSdkKeyForOverview(1)
    }
}