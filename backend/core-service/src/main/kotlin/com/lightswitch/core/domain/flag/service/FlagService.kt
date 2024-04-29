package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.FlagInitRequestDto
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagInitResponseDto
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
import com.lightswitch.core.domain.member.entity.SdkKey
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
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
    private var flagCustomRepository: FlagCustomRepository,

    @Autowired
    private var sdkKeyRepository: SdkKeyRepository
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
            value = flagRequestDto.defaultValue,
            defaultFlag = true,
        )
        variationRepository.save(defaultVariation)

        val variations = flagRequestDto.variations
        for (variation in variations) {
            val savedVariation = Variation(
                flag = savedFlag,
                description = variation.description,
                portion = variation.portion,
                value = variation.value,
            )
            variationRepository.save(savedVariation)
        }

        return this.getFlag(savedFlag.flagId!!)
    }

    fun getAllFlag(): List<FlagSummaryDto> {
        val flagList = flagRepository.findByDeletedAtIsNull()
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
        val defaultVariation = variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
        val variations = variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)
        val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

        if (defaultVariation == null) {
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
            variations = variations.map {
                VariationDto(
                    value = it.value,
                    portion = it.portion,
                    description = it.description
                )
            },
            userId = flag.maintainerId,

            //Todo : BaseEntity 상속받아서 createdAt, updatedAt 사용
            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),

            active = flag.active,
        )
    }

    fun filteredFlags(tags: List<String>): List<FlagResponseDto> {
        val filteredFlags = flagCustomRepository.findByTagContents(tags)
        return filteredFlags.map { flag ->
            val defaultVariation = variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
            val variations = variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)
            val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

            if (defaultVariation == null) {
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
                variations = variations.map {
                    VariationDto(
                        value = it.value,
                        portion = it.portion,
                        description = it.description
                    )
                },
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

    @Transactional
    fun deleteFlag(flagId: Long): Long {
        val flag = flagRepository.findById(flagId).get()
        flag.tags.clear()
        flag.delete()
        flag.tags.map {
            it.flags.remove(flag)
        }

        //flag에 연결된 variation 삭제
        variationRepository.findByFlagAndDeletedAtIsNull(flag).map {
            it.delete()
        }

        return flag.flagId ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
    }

    fun switchFlag(flagId: Long): Long {
        val flag = flagRepository.findById(flagId).get()
        flag.active = !flag.active
        return flagRepository.save(flag).flagId ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
    }

    /*
    * Todo
    *  Frontend -> Backend 변경된 것만 보내고, Backend에서도 변경된 것만 Update 하도록 수정
    *  현재 구현 방식은 Variation이 변경될 경우 기존의 모든 Variations를 Soft Delete 진행 후 새로 생성
    *  이는 Variation이 많아질 경우 성능 이슈가 발생할 수 있음
    *  Variation ID를 추가하여 변경된 것만 Update 하는 방식으로 수정 할 필요 있음. (추후 논의)
    * */
    @Transactional
    fun updateFlag(flagId: Long, flagRequestDto: FlagRequestDto): FlagResponseDto {
        val flag = flagRepository.findById(flagId).get()
        // flag 수정
        flag.title = flagRequestDto.title
        flag.description = flagRequestDto.description
        flag.type = flagRequestDto.type

        // tag 수정
        val savedTagList = mutableListOf<Tag>()
        val tagList = flagRequestDto.tags

        for (tag in tagList) {
            val searchedTag = tagRepository.findByContent(tag.content)
            // 수정 중에 새로운 tag가 추가되는 경우
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
        flag.tags.clear()
        flag.tags.addAll(savedTagList)
        flagRepository.save(flag)

        // variation 수정
        val defaultVariation = variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
            ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)

        defaultVariation.value = flagRequestDto.defaultValue
        defaultVariation.portion = flagRequestDto.defaultValuePortion
        defaultVariation.description = flagRequestDto.defaultValueDescription
        variationRepository.save(defaultVariation)

        variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag).map {
            it.delete()
        }

        flagRequestDto.variations.map {
            val updatedVariation = Variation(
                flag = flag,
                description = it.description,
                portion = it.portion,
                value = it.value,
            )
            variationRepository.save(updatedVariation)
        }

        return this.getFlag(flag.flagId!!)
    }

    fun getFlagCountForOverview(): Map<String, Int> {
        val flagList = flagRepository.findByDeletedAtIsNull()
        val activeFlagList = flagList.filter { it.active }

        return mapOf(
            "totalFlags" to flagList.size,
            "activeFlags" to activeFlagList.size,
        )
    }

    fun getAllFlagForInit(flagInitRequestDto: FlagInitRequestDto): List<FlagInitResponseDto> {

        val sdkKey: SdkKey = sdkKeyRepository.findByKey(flagInitRequestDto.sdkKey) ?: throw BaseException(
            ResponseCode.SDK_KEY_NOT_FOUND
        )
        val maintainerId: Long = sdkKey.member.memberId!!

        val flagList = flagRepository.findByMaintainerIdAndDeletedAtIsNull(maintainerId)
        return flagList.map { flag ->
            val defaultVariation = variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
            val variations =
                variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)

            if (defaultVariation == null) {
                throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
            }

            FlagInitResponseDto(
                flagId = flag.flagId!!,
                title = flag.title,
                description = flag.description,
                type = flag.type,
                defaultValue = defaultVariation.value,
                defaultValuePortion = defaultVariation.portion,
                defaultValueDescription = defaultVariation.description,
                variations = variations.map {
                    VariationDto(
                        value = it.value,
                        portion = it.portion,
                        description = it.description
                    )
                },
                maintainerId = flag.maintainerId,

                createdAt = flag.createdAt.toString(),
                updatedAt = flag.updatedAt.toString(),
                deleteAt = flag.deletedAt.toString(),
                active = flag.active,
            )
        }
    }
}