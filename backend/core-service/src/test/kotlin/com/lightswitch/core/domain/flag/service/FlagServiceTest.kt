package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.req.TagRequestDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
class FlagServiceTest {

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var flagService: FlagService

    @Autowired
    private lateinit var tagRepository: TagRepository

    @Autowired
    private lateinit var variationRepository: VariationRepository

    @Transactional
    @BeforeEach
    fun setUp() {
        variationRepository.deleteAll()
        /*
        * CasecadeType.ALL 설정으로 인해 Flag 삭제 시 Flag_Tag도 함께 삭제
        * FetchLazy의 경우 영속성 컨텍스트 생존 범위 밖에서 객체 initialize가 불가능
        * 따라서, @Transactional이 붙은 비즈니스 로직(Service)에서 사용해야 함
        * 참고: https://zzang9ha.tistory.com/406
        * */
        flagService.deleteAllFlag()
        tagRepository.deleteAll()
    }

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

    @Test
    fun `플래그 다중 필터링 서비스 로직 테스트`() {

        val tag = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "v1.0"
        )

        val tag2 = TagRequestDto(
            colorHex = "#000000",
            content = "v2.0"
        )

        val tag3 = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "UI"
        )

        val tag4 = TagRequestDto(
            colorHex = "#000000",
            content = "UX"
        )

        val flagRequestDto = FlagRequestDto(
            title = "test",
            tags = listOf(tag, tag2, tag3, tag4),
            description = "test",
            type = FlagType.BOOLEAN,
            defaultValue = "TRUE",
            defaultValuePortion = 50,
            defaultValueDescription = "true test",
            variation = "FALSE",
            variationPortion = 50,
            variationDescription = "false test",
            userId = 1L
        )
        flagService.createFlag(flagRequestDto)

        val flagRequestDto2 = FlagRequestDto(
            title = "test2",
            tags = listOf(tag2, tag3),
            description = "test2",
            type = FlagType.INTEGER,
            defaultValue = "1",
            defaultValuePortion = 80,
            defaultValueDescription = "1 test",
            variation = "2",
            variationPortion = 20,
            variationDescription = "2 test",
            userId = 2L
        )
        flagService.createFlag(flagRequestDto2)

        val flagRequestDto3 = FlagRequestDto(
            title = "test3",
            tags = listOf(tag3, tag4),
            description = "test3",
            type = FlagType.INTEGER,
            defaultValue = "A",
            defaultValuePortion = 10,
            defaultValueDescription = "A test",
            variation = "B",
            variationPortion = 90,
            variationDescription = "B test",
            userId = 3L
        )
        flagService.createFlag(flagRequestDto3)


        val result = flagService.filteredFlags(listOf(tag4.content))
        assertThat(result).hasSize(2)

        val result2 = flagService.filteredFlags(listOf(tag.content))
        assertThat(result2).hasSize(1)

        val result3 = flagService.filteredFlags(
            listOf(
                tag.content,
                tag2.content
            )
        )
        assertThat(result3).hasSize(1)

        val result4 = flagService.filteredFlags(
            listOf(
                tag2.content,
                tag3.content
            )
        )
        assertThat(result4).hasSize(2)

        val result5 = flagService.filteredFlags(
            listOf(
                tag3.content,
                tag4.content
            )
        )
        assertThat(result5).hasSize(2)

        val result6 = flagService.filteredFlags(listOf(tag3.content))
        assertThat(result6).hasSize(3)
    }
}