package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.FlagInitRequestDto
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagSummaryDto
import com.lightswitch.core.domain.flag.dto.res.FlagInitResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagIdResponseDto
import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.dto.res.FlagTitleResponseDto
import com.lightswitch.core.domain.flag.repository.*
import com.lightswitch.core.domain.flag.repository.entity.*
import com.lightswitch.core.domain.flag.repository.queydsl.FlagCustomRepository
import com.lightswitch.core.domain.member.entity.SdkKey
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import com.lightswitch.core.domain.sse.dto.SseDto
import com.lightswitch.core.domain.sse.service.SseService
import com.lightswitch.core.util.toJson
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
    private var sdkKeyRepository: SdkKeyRepository,

    @Autowired
    private var sseService: SseService,

    @Autowired
    private var keywordRepository: KeywordRepository,

    @Autowired
    private var flagKeywordMappingRepository: FlagKeywordMappingRepository,
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
            description = flagRequestDto.defaultDescription,
            portion = flagRequestDto.defaultPortion,
            value = flagRequestDto.defaultValue,
            defaultFlag = true,
            flagKeywordMapping = null,
        )
        variationRepository.save(defaultVariation)

        val variations = flagRequestDto.variations
        for (variation in variations) {
            val savedVariation = Variation(
                flag = savedFlag,
                description = variation.description,
                portion = variation.portion,
                value = variation.value,
                flagKeywordMapping = null,
            )
            variationRepository.save(savedVariation)
        }

        val savedKeywordList = mutableListOf<Keyword>()
        val keywordList = flagRequestDto.keywords
        for (keyword in keywordList) {
            val searchedKeyword = keywordRepository.findByKeyword(keyword.keyword)
            if (searchedKeyword == null) {
                val savedKeyword = keywordRepository.save(
                    Keyword(
                        keyword = keyword.keyword,
                        description = keyword.description,
                    )
                )
                savedKeywordList.add(savedKeyword)
            } else {
                savedKeywordList.add(searchedKeyword)
            }
        }

        val flagKeywordMapping = FlagKeywordMapping(
            flag = savedFlag,
            keywords = savedKeywordList,
        )
        val savedFlagKeywordMapping = flagKeywordMappingRepository.save(flagKeywordMapping)

        val defaultVariationForKeyword = Variation(
            flag = savedFlag,
            description = flagRequestDto.defaultDescriptionForKeyword,
            portion = flagRequestDto.defaultPortionForKeyword,
            value = flagRequestDto.defaultValueForKeyword,
            defaultFlag = true,
            flagKeywordMapping = savedFlagKeywordMapping
        )
        variationRepository.save(defaultVariationForKeyword)

        val variationsForKeyword = flagRequestDto.variationsForKeyword
        for (variation in variationsForKeyword) {
            val savedVariation = Variation(
                flag = savedFlag,
                description = variation.description,
                portion = variation.portion,
                value = variation.value,
                flagKeywordMapping = savedFlagKeywordMapping
            )
            variationRepository.save(savedVariation)
        }

        val flagInitResponseDto = FlagInitResponseDto(
            flagId = savedFlag.flagId!!,
            title = savedFlag.title,
            description = savedFlag.description,
            type = savedFlag.type,
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
            variations = variations,
            maintainerId = savedFlag.maintainerId,

            createdAt = savedFlag.createdAt.toString(),
            updatedAt = savedFlag.updatedAt.toString(),
            deleteAt = savedFlag.deletedAt.toString(),
            active = savedFlag.active,

            keywords = keywordList,
            defaultValueForKeyword = defaultVariationForKeyword.value,
            defaultPortionForKeyword = defaultVariationForKeyword.portion,
            defaultDescriptionForKeyword = defaultVariationForKeyword.description,
            variationsForKeyword = variationsForKeyword,
        )

        // Todo craete한 User의 SDK키를 이용하여 SSE 데이터 전송
        sseService.sendData(SseDto("1234", SseDto.SseType.CREATE, toJson(flagInitResponseDto)))

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
        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag)
        val variations =
            variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag)
        val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

        if (defaultVariation == null) {
            throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        }

        val flagKeywordMapping = flagKeywordMappingRepository.findByFlagAndDeletedAtIsNull(flag)

        val defaultVariationForKeyword =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)
        val variationsForKeyword =
            variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)

        return FlagResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            tags = tagList,
            description = flag.description,
            type = flag.type,
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
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

            keywords = flagKeywordMapping.keywords.map {
                KeywordDto(
                    keyword = it.keyword,
                    description = it.description
                )
            } ?: listOf(),
            defaultValueForKeyword = defaultVariationForKeyword?.value ?: "",
            defaultPortionForKeyword = defaultVariationForKeyword?.portion ?: 0,
            defaultDescriptionForKeyword = defaultVariationForKeyword?.description ?: "",
            variationsForKeyword = variationsForKeyword.map {
                VariationDto(
                    value = it.value,
                    portion = it.portion,
                    description = it.description
                )
            },
        )
    }

    fun filteredFlags(tags: List<String>): List<FlagResponseDto> {
        val filteredFlags = flagCustomRepository.findByTagContents(tags)
        return filteredFlags.map { flag ->
            val defaultVariation =
                variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag)
            val variations =
                variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag)
            val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

            if (defaultVariation == null) {
                throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
            }

            val flagKeywordMapping = flagKeywordMappingRepository.findByFlagAndDeletedAtIsNull(flag)

            val defaultVariationForKeyword =
                variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)
            val variationsForKeyword =
                variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)

            FlagResponseDto(
                flagId = flag.flagId!!,
                title = flag.title,
                tags = tagList,
                description = flag.description,
                type = flag.type,
                defaultValue = defaultVariation.value,
                defaultPortion = defaultVariation.portion,
                defaultDescription = defaultVariation.description,
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

                keywords = flagKeywordMapping.keywords.map {
                    KeywordDto(
                        keyword = it.keyword,
                        description = it.description
                    )
                } ?: listOf(),
                defaultValueForKeyword = defaultVariationForKeyword?.value ?: "",
                defaultPortionForKeyword = defaultVariationForKeyword?.portion ?: 0,
                defaultDescriptionForKeyword = defaultVariationForKeyword?.description ?: "",
                variationsForKeyword = variationsForKeyword.map {
                    VariationDto(
                        value = it.value,
                        portion = it.portion,
                        description = it.description
                    )
                },
            )
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

        val flagKeywordMapping = flagKeywordMappingRepository.findByFlagAndDeletedAtIsNull(flag)
        flagKeywordMapping.keywords.map {
            it.flagKeywordMappings.remove(flagKeywordMapping)
        }
        flagKeywordMapping.delete()

        // Todo craete한 User의 SDK키를 이용하여 SSE 데이터 전송
        sseService.sendData(SseDto("1234", SseDto.SseType.DELETE, toJson(FlagTitleResponseDto(flag.title))))

        return flag.flagId ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
    }

    fun switchFlag(flagId: Long): Long {
        val flag = flagRepository.findById(flagId).get()
        flag.active = !flag.active

        // Todo craete한 User의 SDK키를 이용하여 SSE 데이터 전송
        sseService.sendData(SseDto("1234", SseDto.SseType.SWITCH, toJson(FlagIdResponseDto(flagId))))

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

        /*
        * Todo... tag 수정 확인
        * */
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
        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag)
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)

        defaultVariation.value = flagRequestDto.defaultValue
        defaultVariation.portion = flagRequestDto.defaultPortion
        defaultVariation.description = flagRequestDto.defaultDescription
        variationRepository.save(defaultVariation)

        variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag).map {
            it.delete()
        }

        flagRequestDto.variations.map {
            val updatedVariation = Variation(
                flag = flag,
                description = it.description,
                portion = it.portion,
                value = it.value,
                flagKeywordMapping = null,
            )
            variationRepository.save(updatedVariation)
        }

        val searchFlagKeywordMapping = flagKeywordMappingRepository.findByFlagAndDeletedAtIsNull(flag)
        val savedKeywordList = mutableListOf<Keyword>()
        val keywordList = flagRequestDto.keywords
        for (keyword in keywordList) {
            val searchedKeyword = keywordRepository.findByKeyword(keyword.keyword)
            if (searchedKeyword == null) {
                val savedKeyword = keywordRepository.save(
                    Keyword(
                        keyword = keyword.keyword,
                        description = keyword.description,
                    )
                )
                savedKeywordList.add(savedKeyword)
            } else {
                savedKeywordList.add(searchedKeyword)
            }
        }

        searchFlagKeywordMapping.keywords.clear()
        searchFlagKeywordMapping.keywords.addAll(savedKeywordList)
        flagKeywordMappingRepository.save(searchFlagKeywordMapping)

        val defaultVariationForKeyword =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(
                flag
            )
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)

        defaultVariationForKeyword.value = flagRequestDto.defaultValueForKeyword
        defaultVariationForKeyword.portion = flagRequestDto.defaultPortionForKeyword
        defaultVariationForKeyword.description = flagRequestDto.defaultDescriptionForKeyword
        variationRepository.save(defaultVariationForKeyword)

        variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)
            .map {
                it.delete()
            }

        flagRequestDto.variationsForKeyword.map {
            val updatedVariation = Variation(
                flag = flag,
                description = it.description,
                portion = it.portion,
                value = it.value,
                flagKeywordMapping = searchFlagKeywordMapping,
            )
            variationRepository.save(updatedVariation)
        }

        // Todo create한 User의 SDK키를 이용하여 SSE 데이터 전송
        val flagInitResponseDto = FlagInitResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            description = flag.description,
            type = flag.type,
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
            variations = flagRequestDto.variations,
            maintainerId = flag.maintainerId,
            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),
            deleteAt = flag.deletedAt.toString(),
            active = flag.active,

            keywords = savedKeywordList.map {
                KeywordDto(
                    keyword = it.keyword,
                    description = it.description
                )
            },
            defaultValueForKeyword = defaultVariation.value,
            defaultPortionForKeyword = defaultVariation.portion,
            defaultDescriptionForKeyword = defaultVariation.description,
            variationsForKeyword = flagRequestDto.variationsForKeyword,
        )
        sseService.sendData(SseDto("1234", SseDto.SseType.UPDATE, toJson(flagInitResponseDto)))

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
            val allVariation = variationRepository.findByFlagAndDeletedAtIsNull(flag)

            var defaultValue = ""
            var defaultPortion = 0
            var defaultDescription = ""
            var variations = listOf<VariationDto>()
            var keywords = listOf<KeywordDto>()
            var defaultValueForKeyword = ""
            var defaultPortionForKeyword = 0
            var defaultDescriptionForKeyword = ""
            var variationsForKeyword = listOf<VariationDto>()

            allVariation.map { variation ->
                if (variation.defaultFlag) {
                    if (variation.flagKeywordMapping == null) {
                        defaultValue = variation.value
                        defaultPortion = variation.portion
                        defaultDescription = variation.description
                    } else {
                        defaultValueForKeyword = variation.value
                        defaultPortionForKeyword = variation.portion
                        defaultDescriptionForKeyword = variation.description
                        keywords = variation.flagKeywordMapping!!.keywords.map {
                            KeywordDto(
                                keyword = it.keyword,
                                description = it.description
                            )
                        }
                    }
                } else {
                    if (variation.flagKeywordMapping == null) {
                        variations += VariationDto(
                            value = variation.value,
                            portion = variation.portion,
                            description = variation.description
                        )
                    } else {
                        variationsForKeyword += VariationDto(
                            value = variation.value,
                            portion = variation.portion,
                            description = variation.description
                        )
                    }
                }
            }

            FlagInitResponseDto(
                flagId = flag.flagId!!,
                title = flag.title,
                description = flag.description,
                type = flag.type,
                defaultValue = defaultValue,
                defaultPortion = defaultPortion,
                defaultDescription = defaultDescription,
                variations = variations,
                maintainerId = flag.maintainerId,
                createdAt = flag.createdAt.toString(),
                updatedAt = flag.updatedAt.toString(),
                deleteAt = flag.deletedAt.toString(),
                active = flag.active,
                keywords = keywords,
                defaultValueForKeyword = defaultValueForKeyword,
                defaultPortionForKeyword = defaultPortionForKeyword,
                defaultDescriptionForKeyword = defaultDescriptionForKeyword,
                variationsForKeyword = variationsForKeyword
            )

//            val defaultVariation =
//                variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNullAndDeletedAtIsNull(flag)
//            val variations =
//                variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNullAndDeletedAtIsNull(
//                    flag
//                )
//
//            if (defaultVariation == null) {
//                throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
//            }
//
//            val flagKeywordMapping = flagKeywordMappingRepository.findByFlagAndDeletedAtIsNull(flag)
//
//            val defaultVariationForKeyword =
//                variationRepository.findByFlagAndDefaultFlagIsTrueAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)
//            val variationsForKeyword =
//                variationRepository.findByFlagAndDefaultFlagIsFalseAndFlagKeywordMappingIsNotNullAndDeletedAtIsNull(flag)

//            FlagInitResponseDto(
//                flagId = flag.flagId!!,
//                title = flag.title,
//                description = flag.description,
//                type = flag.type,
//                defaultValue = defaultVariation.value,
//                defaultValuePortion = defaultVariation.portion,
//                defaultValueDescription = defaultVariation.description,
//                variations = variations.map {
//                    VariationDto(
//                        value = it.value,
//                        portion = it.portion,
//                        description = it.description
//                    )
//                },
//                maintainerId = flag.maintainerId,
//
//                createdAt = flag.createdAt.toString(),
//                updatedAt = flag.updatedAt.toString(),
//                deleteAt = flag.deletedAt.toString(),
//                active = flag.active,
//
//                keywords = flagKeywordMapping?.keywords?.map {
//                    KeywordDto(
//                        keyword = it.keyword,
//                        description = it.description
//                    )
//                } ?: listOf(),
//                defaultValueForKeyword = defaultVariationForKeyword?.value ?: "",
//                defaultValuePortionForKeyword = defaultVariationForKeyword?.portion ?: 0,
//                defaultValueDescriptionForKeyword = defaultVariationForKeyword?.description ?: "",
//                variationsForKeyword = variationsForKeyword.map {
//                    VariationDto(
//                        value = it.value,
//                        portion = it.portion,
//                        description = it.description
//                    )
//                }
//            )
        }
    }

    fun getFlagsSummaryByKeyword(keyword: String): List<FlagSummaryDto> {
        val flagList = flagRepository.findByTitleContainingAndDeletedAtIsNull(keyword)
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
}