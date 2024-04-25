package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Tag
import com.lightswitch.core.domain.flag.repository.entity.Variation
import com.lightswitch.core.domain.flag.repository.queydsl.FlagCustomRepository
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

    @Autowired
    private var flagCustomRepository: FlagCustomRepository
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
            flag = savedFlag,
            description = flagRequestDto.defaultValueDescription,
            portion = flagRequestDto.defaultValuePortion,
            variationType = flagRequestDto.type,
            value = flagRequestDto.defaultValue,
            defaultFlag = true,
        )

        val variation = Variation(
            flag = savedFlag,
            description = flagRequestDto.variationDescription,
            portion = flagRequestDto.variationPortion,
            variationType = flagRequestDto.type,
            value = flagRequestDto.variation,
        )
        variationRepository.save(defaultVariation)
        variationRepository.save(variation)

        return this.getFlag(savedFlag.flagId!!)
    }

    fun getAllFlag(): List<FlagSummaryDto> {
        val flagList = flagRepository.findAll()
        return flagList.map { flag ->
            FlagSummaryDto(
                flagId = flag.flagId!!,
                title = flag.title,
                description = flag.description,
                tags = flag.tags.map { TagResponseDto(it.colorHex, it.content) },
                active = flag.active,
                //Todo : User 기능 구현 후 maintainerName 변경
                maintainerName = "test",
            )
        }
    }

    fun getFlag(flagId: Long): FlagResponseDto {
        val flag = flagRepository.findById(flagId).get()
        val defaultVariation = variationRepository.findByFlagAndDefaultFlag(flag, true)
        val variation = variationRepository.findByFlagAndDefaultFlag(flag, false)
        val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

        if (defaultVariation == null || variation == null) {
            throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        }

        return FlagResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            tags = tagList,
            description = flag.description,
            type = flag.type,
            defaultValue = defaultVariation.value,
            defaultValuePortion = defaultVariation.portion,
            defaultValueDescription = defaultVariation.description,
            variation = variation.value,
            variationPortion = variation.portion,
            variationDescription = variation.description,
            userId = flag.maintainerId,

            //Todo : BaseEntity 상속받아서 createdAt, updatedAt 사용
            createdAt = LocalDateTime.now().toString(),
            updatedAt = LocalDateTime.now().toString(),
            active = flag.active,
        )
    }

    fun filteredFlags(tags: List<String>): List<FlagResponseDto> {
        val filteredFlags = flagCustomRepository.findByTagContents(tags)
        return filteredFlags.map { flag ->
            val defaultVariation = variationRepository.findByFlagAndDefaultFlag(flag, true)
            val variation = variationRepository.findByFlagAndDefaultFlag(flag, false)
            val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

            if (defaultVariation == null || variation == null) {
                throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
            }

            FlagResponseDto(
                flagId = flag.flagId!!,
                title = flag.title,
                tags = tagList,
                description = flag.description,
                type = flag.type,
                defaultValue = defaultVariation.value,
                defaultValuePortion = defaultVariation.portion,
                defaultValueDescription = defaultVariation.description,
                variation = variation.value,
                variationPortion = variation.portion,
                variationDescription = variation.description,
                userId = flag.maintainerId,

                //Todo : BaseEntity 상속받아서 createdAt, updatedAt 사용
                createdAt = LocalDateTime.now().toString(),
                updatedAt = LocalDateTime.now().toString(),
                active = flag.active,
            )
        }
    }

    @Transactional
    fun deleteAllFlag() {
        val flags: List<Flag> = flagRepository.findAll()
        for (flag in flags) {
            flag.tags.clear()
        }
    }
}