package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.req.TagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Tag
import com.lightswitch.core.domain.flag.repository.entity.Variation
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDateTime

@SpringBootTest
class FlagServiceTest {

    @Autowired
    private lateinit var flagService: FlagService

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var tagRepository: TagRepository

    @Autowired
    private lateinit var variationRepository: VariationRepository

    fun createFlag(flagRequestDto: FlagRequestDto): FlagResponseDto {
        // flag 저장
        val savedFlag = flagRepository.save(
            Flag(
                title = flagRequestDto.title,
                description = flagRequestDto.description,
                type = flagRequestDto.type,
                maintainerId = flagRequestDto.userId,
            )
        )

        // tag 저장
        val savedTagList = mutableListOf<Tag>()
        val tagList = flagRequestDto.tags
        for (tag in tagList) {
            val searchedTag = tagRepository.findByContent(tag.content)
            if (searchedTag == null) {
                val savedTag = tagRepository.save(
                    Tag(
                        colorHex = tag.colorHex,
                        content = tag.content,
                    )
                )
                savedTagList.add(savedTag)
                println(savedTag.content)
            } else {
                savedTagList.add(searchedTag)
                println(searchedTag.content)
            }
        }
        savedFlag.tags.addAll(savedTagList)
        flagRepository.save(savedFlag)

        // variation 저장
        val defaultVariation = Variation(
            flagId = savedFlag,
            description = flagRequestDto.defaultValueDescription,
            portion = flagRequestDto.defaultValuePortion,
            variationType = flagRequestDto.type,
            value = flagRequestDto.defaultValue,
        )

        val variation = Variation(
            flagId = savedFlag,
            description = flagRequestDto.variationDescription,
            portion = flagRequestDto.variationPortion,
            variationType = flagRequestDto.type,
            value = flagRequestDto.variation,
        )
        val savedDefaultVariation = variationRepository.save(defaultVariation)
        val savedVariation = variationRepository.save(variation)

        // 반환값 조립
        val flagResponseDto = FlagResponseDto(
            flagId = savedFlag.flagId!!,
            title = savedFlag.title,
            tags = savedFlag.tags.map { TagResponseDto(it.colorHex, it.content) },
            description = savedFlag.description,
            type = savedFlag.type,
            defaultValue = savedDefaultVariation.value,
            defaultValuePortion = savedDefaultVariation.portion,
            defaultValueDescription = savedDefaultVariation.description,
            variation = savedVariation.value,
            variationPortion = savedVariation.portion,
            variationDescription = savedVariation.description,
            userId = savedFlag.maintainerId,
            createdAt = LocalDateTime.now().toString(),
            updatedAt = LocalDateTime.now().toString(),
        )

        return flagResponseDto
    }

    @Test
    fun createFlagTest() {
        // given
        val tag1: TagRequestDto = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2: TagRequestDto = TagRequestDto(
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
        assertEquals(flagRequestDto.tags.size, 2)
    }
}