package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Tag
import com.lightswitch.core.domain.flag.repository.entity.Variation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class FlagService(
    @Autowired
    private var flagRepository: FlagRepository,

    @Autowired
    private var tagRepository: TagRepository,

    @Autowired
    private var variationRepository: VariationRepository,
) {

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
            } else {
                savedTagList.add(searchedTag)
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

        // 반환객체 조립
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
}