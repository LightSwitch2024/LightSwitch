package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.req.TagRequestDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class FlagServiceTest {

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var flagService: FlagService

//    @Autowired
//    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var tagRepository: TagRepository

//    @Autowired
//    private lateinit var variationRepository: VariationRepository

    @Test
    fun `flag 생성 test 1 _ 일반값 Boolean`() {
        // given
        val tag1 = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = TagRequestDto(
            colorHex = "#000000",
            content = "test2"
        )

        val flagRequestDto = FlagRequestDto(
            title = "test",
            tags = listOf(tag1, tag2),
            description = "test",
            type = FlagType.BOOLEAN,
            defaultValue = "TRUE",
            defaultValuePortion = 100,
            defaultValueDescription = "test",
            variation = "FALSE",
            variationPortion = 0,
            variationDescription = "test",
            userId = 1L
        )

        // when
        val flagResponseDto = flagService.createFlag(flagRequestDto)

        // then
        assertNotNull(flagResponseDto.flagId)
        assertEquals(flagRequestDto.title, flagResponseDto.title)
        assertEquals(flagRequestDto.description, flagResponseDto.description)
        for (tag in flagResponseDto.tags) {
            val tagFoundByContent = tagRepository.findByContent(tag.content)
            if (tagFoundByContent != null) {
                assertEquals(tagFoundByContent.colorHex, tag.colorHex)
            }
        }
    }

    @Test
    fun `flag 생성 test 1 _ 일반값 String`() {
        // given
        val tag1 = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = TagRequestDto(
            colorHex = "#000000",
            content = "test2"
        )

        val flagRequestDto = FlagRequestDto(
            title = "test",
            tags = listOf(tag1, tag2),
            description = "test",
            type = FlagType.STRING,
            defaultValue = "A",
            defaultValuePortion = 100,
            defaultValueDescription = "test",
            variation = "B",
            variationPortion = 0,
            variationDescription = "test",
            userId = 1L
        )

        // when
        val flagResponseDto = flagService.createFlag(flagRequestDto)

        // then
        assertNotNull(flagResponseDto.flagId)
        assertEquals(flagRequestDto.title, flagResponseDto.title)
        assertEquals(flagRequestDto.description, flagResponseDto.description)
        for (tag in flagResponseDto.tags) {
            val tagFoundByContent = tagRepository.findByContent(tag.content)
            if (tagFoundByContent != null) {
                assertEquals(tagFoundByContent.colorHex, tag.colorHex)
            }
        }
    }

    @Test
    fun `flag 생성 test 1 _ 일반값 Integer`() {
        // given
        val tag1 = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = TagRequestDto(
            colorHex = "#000000",
            content = "test2"
        )

        val flagRequestDto = FlagRequestDto(
            title = "test",
            tags = listOf(tag1, tag2),
            description = "test",
            type = FlagType.INTEGER,
            defaultValue = "1",
            defaultValuePortion = 100,
            defaultValueDescription = "test",
            variation = "2",
            variationPortion = 0,
            variationDescription = "test",
            userId = 1L
        )

        // when
        val flagResponseDto = flagService.createFlag(flagRequestDto)

        // then
        assertNotNull(flagResponseDto.flagId)
        assertEquals(flagRequestDto.title, flagResponseDto.title)
        assertEquals(flagRequestDto.description, flagResponseDto.description)
        for (tag in flagResponseDto.tags) {
            val tagFoundByContent = tagRepository.findByContent(tag.content)
            if (tagFoundByContent != null) {
                assertEquals(tagFoundByContent.colorHex, tag.colorHex)
            }
        }
    }

    @Test
    fun `Flag 단건 조회 by flag_id`() {
        // given
        val tag1 = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = TagRequestDto(
            colorHex = "#000000",
            content = "test2"
        )

        val flagRequestDto = FlagRequestDto(
            title = "test",
            tags = listOf(tag1, tag2),
            description = "test",
            type = FlagType.INTEGER,
            defaultValue = "1",
            defaultValuePortion = 100,
            defaultValueDescription = "test",
            variation = "2",
            variationPortion = 0,
            variationDescription = "test",
            userId = 1L
        )
        val flagResponseDto = flagService.createFlag(flagRequestDto)

        val flagId = flagResponseDto.flagId

        // when
        val testFlagResponseDto = flagService.getFlag(flagId)

        // then
        assertThat(testFlagResponseDto).isNotNull
        assertThat(testFlagResponseDto.flagId).isEqualTo(flagResponseDto.flagId)
        assertThat(testFlagResponseDto.defaultValue).isNotNull
        assertThat(testFlagResponseDto.variation).isNotNull
        assertThat(testFlagResponseDto.tags.size).isEqualTo(2)
    }

    @Test
    fun `Flag 전체 조회`() {
        // given

        // when
        val flagList = flagService.getAllFlag()

        // then
        assertThat(flagList.size).isEqualTo(flagRepository.countBy())
    }
}