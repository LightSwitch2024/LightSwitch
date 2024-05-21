package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.common.enum.FlagType.*
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.PropertyDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.*
import com.lightswitch.core.domain.flag.dto.res.*
import com.lightswitch.core.domain.flag.repository.*
import com.lightswitch.core.domain.flag.repository.entity.*
import com.lightswitch.core.domain.flag.repository.queydsl.FlagCustomRepository
import com.lightswitch.core.domain.history.dto.HistoryResponse
import com.lightswitch.core.domain.history.repository.HistoryRepository
import com.lightswitch.core.domain.history.repository.entity.History
import com.lightswitch.core.domain.history.repository.entity.HistoryType
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import com.lightswitch.core.domain.organization.service.OrganizationService
import com.lightswitch.core.domain.sse.dto.SseDto
import com.lightswitch.core.domain.sse.service.SseService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

private val logger = KotlinLogging.logger {}

@Service
class FlagService(
    @Autowired
    private val flagRepository: FlagRepository,

    @Autowired
    private val tagRepository: TagRepository,

    @Autowired
    private val variationRepository: VariationRepository,

    @Autowired
    private val flagCustomRepository: FlagCustomRepository,

    @Autowired
    private val sdkKeyRepository: SdkKeyRepository,

    @Autowired
    private val sseService: SseService,

    @Autowired
    private val keywordRepository: KeywordRepository,

    @Autowired
    private val memberRepository: MemberRepository,

    @Autowired
    private val propertyRepository: PropertyRepository,

    @Autowired
    private val historyRepository: HistoryRepository,

    @Autowired
    private val oraganizationService: OrganizationService,
) {

    fun buildSSEData(flag: Flag): FlagInitResponseDto {
        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        val variations =
            variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)

        return FlagInitResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            description = flag.description,
            type = flag.type,
            keywords = flag.keywords.map { k ->
                KeywordDto(
                    properties = k.properties.map { p ->
                        PropertyDto(
                            property = p.property,
                            data = p.data,
                        )
                    },
                    description = k.description,
                    value = k.value,
                )
            },
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

            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),
            deleteAt = flag.deletedAt?.toString() ?: "",

            maintainerId = flag.maintainer.memberId!!,
            active = flag.active,
        )
    }

    fun buildSSEData(flagResponseDto: FlagResponseDto): FlagInitResponseDto {
        val variations =
            flagResponseDto.flagId?.let { variationRepository.findByFlagFlagId(it) }
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)

        val default = variations.first { variation: Variation -> variation.defaultFlag }

        val copy = flagResponseDto.copy(
            defaultValue = default.value,
            defaultPortion = default.portion,
            defaultDescription = default.description,
            variations = variations.filter { !it.defaultFlag }.map {
                VariationDto(
                    variationId = it.variationId,
                    value = it.value,
                    portion = it.portion,
                    description = it.description
                )
            }
        )
        return copy.toSseInitDto()
    }

    @Transactional
    fun createFlag(flagRequestDto: FlagRequestDto): FlagResponseDto {
        logger.info { "createFlag Called" }
        val member = memberRepository.findById(flagRequestDto.memberId)
            .orElseThrow { BaseException(ResponseCode.MEMBER_NOT_FOUND) }
        logger.info { "member 조회 성공. member : $member" }
        val savedFlag = flagRepository.save(
            Flag(
                title = flagRequestDto.title,
                description = flagRequestDto.description,
                type = flagRequestDto.type,
                maintainer = member,
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

        // variation 저장
        val defaultVariation = Variation(
            flag = savedFlag,
            description = flagRequestDto.defaultDescription,
            portion = flagRequestDto.defaultPortion,
            value = flagRequestDto.defaultValue,
            defaultFlag = true,
        )
        variationRepository.save(defaultVariation)

        for (variation in flagRequestDto.variations) {
            val savedVariation = Variation(
                flag = savedFlag,
                description = variation.description,
                portion = variation.portion,
                value = variation.value,
            )
            variationRepository.save(savedVariation)
        }

        // type & value validation
        when (flagRequestDto.type) {
            BOOLEAN -> {
                if (flagRequestDto.defaultValue != "TRUE" && flagRequestDto.defaultValue != "FALSE") {
                    throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                }
                for (variation in flagRequestDto.variations) {
                    if (variation.value != "TRUE" && variation.value != "FALSE") {
                        throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                    }
                }
                // 둘다 True 인 경우
                if (flagRequestDto.defaultValue == "TRUE" && flagRequestDto.variations.any { it.value == "TRUE" }) {
                    throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                }
                // 둘다 False 인 경우
                if (flagRequestDto.defaultValue == "FALSE" && flagRequestDto.variations.any { it.value == "FALSE" }) {
                    throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                }
            }

            STRING -> {
                if (flagRequestDto.defaultValue.isEmpty()) {
                    throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                }
                for (variation in flagRequestDto.variations) {
                    if (variation.value.isEmpty()) {
                        throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                    }
                }
            }

            INTEGER -> {
                if (!flagRequestDto.defaultValue.matches(Regex("^[0-9]*$"))) {
                    throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                }
                for (variation in flagRequestDto.variations) {
                    if (!variation.value.matches(Regex("^[0-9]*$"))) {
                        throw BaseException(ResponseCode.INVALID_FLAG_VALUE)
                    }
                }
            }

            JSON -> TODO()
        }

        // SSE 데이터 전송
        val flagInitResponseDto = buildSSEData(savedFlag)
        sseService.sendData(SseDto("", SseDto.SseType.CREATE, flagInitResponseDto))

        val flagResponseDto = FlagResponseDto(savedFlag)

        return flagResponseDto
    }

    fun confirmDuplicateTitle(title: String): Boolean {
        return flagRepository.existsByTitleAndDeletedAtIsNull(title)
    }

    fun getAllFlag(): List<FlagSummaryDto> {
        val flagList = flagRepository.findByDeletedAtIsNullOrderByCreatedAt()
        return flagList.map { flag ->
            FlagSummaryDto(
                flagId = flag.flagId!!,
                title = flag.title,
                description = flag.description,
                tags = flag.tags.map { TagResponseDto(it.colorHex, it.content) },
                active = flag.active,
                maintainerName = "${flag.maintainer.firstName} ${flag.maintainer.lastName}",
            )
        }
    }

    fun getFlag(flagId: Long): FlagResponseDto {

//        val flag = flagRepository.findFlagWithActiveKeywords(flagId) ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
//        val flag = flagRepository.findById(flagId).get()
        val flag =
            flagRepository.findFlagsWithNoDeletedKeywords(flagId) ?: throw BaseException(
                ResponseCode.FLAG_NOT_FOUND
            )
        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
        val variations =
            variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)
        val tagList = flag.tags.map { TagResponseDto(it.colorHex, it.content) }

        if (defaultVariation == null) {
            throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        }

//        flag 의 keywords의 deleted at 이 null 인 것만 남기기
        // TODO : flag의 keywords의 deletedAt이 null인 것만 남기기 <- 이 과정을 서비스 로직으로 처리하는 것이 맞는지 확인 필요, 쿼리로 처리하는 것이 더 효율적인지 확인 필요
        val keywordList = flag.keywords.filter { it.deletedAt == null }

        val histories = historyRepository.findByFlagFlagId(flagId)

        return FlagResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            tags = tagList,
            description = flag.description,
            type = flag.type,
            keywords = keywordList.map { k ->
                KeywordDto(
                    keywordId = k.keywordId,
                    properties = k.properties.map { p ->
                        PropertyDto(
                            propertyId = p.propertyId,
                            property = p.property,
                            data = p.data,
                        )
                    },
                    description = k.description,
                    value = k.value,
                )
            },
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
            variations = variations.map {
                VariationDto(
                    variationId = it.variationId,
                    value = it.value,
                    portion = it.portion,
                    description = it.description
                )
            },
            memberId = flag.maintainer.memberId!!,
            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),
            active = flag.active,
            histories = histories
        )
    }

    fun filteredFlags(tags: List<String>): List<FlagResponseDto> {
        val filteredFlags = flagCustomRepository.findByTagContents(tags)
        return filteredFlags.map { flag ->
            val defaultVariation =
                variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
            val variations =
                variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)
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
                keywords = flag.keywords.map { k ->
                    KeywordDto(
                        properties = k.properties.map { p ->
                            PropertyDto(
                                property = p.property,
                                data = p.data,
                            )
                        },
                        description = k.description,
                        value = k.value,
                    )
                },
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
                memberId = flag.maintainer.memberId!!,

                createdAt = LocalDateTime.now().toString(),
                updatedAt = LocalDateTime.now().toString(),

                active = flag.active,
            )
        }
    }

    /**
     * flagId에 해당하는 Flag의 variation과 keyword를 Soft Delete
     */
    @Transactional
    fun deleteFlag(flagId: Long): Long {
        val flag = flagRepository.findById(flagId).get()
        flag.tags.map {
            it.flags.remove(flag)
        }
        flag.tags.clear()

        flag.keywords.map { k ->
            k.properties.map { p ->
                p.delete()
            }
            k.properties.clear()
            k.delete()
        }
        flag.keywords.clear()
        flag.delete()

        // history 저장
        flag.histories.add(
            History(
                historyId = null,
                action = HistoryType.DELETE_FLAG,
                flag = flag,
                target = flag.title,
                current = flag.title,
                previous = "",
            )
        )

        //flag에 연결된 variation 삭제
        variationRepository.findByFlagAndDeletedAtIsNull(flag).map {
            it.delete()
        }

        sseService.sendData(
            SseDto(
                "",
                SseDto.SseType.DELETE,
                FlagTitleResponseDto(flag.title)
            )
        )

        return flag.flagId ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
    }

    /**
     * flagId에 해당하는 Flag의 variation과 keyword를 Hard Delete
     * 현재 채택하고 있는 구현 방식입니다
     */
    @Transactional
    fun deleteFlagWithHardDelete(flagId: Long): Long {
        val flag = flagRepository.findById(flagId).get()
        flag.tags.map {
            it.flags.remove(flag)
        }
        flag.tags.clear()

        // variation & keyword hard delete
        variationRepository.deleteByFlagFlagId(flagId)
        keywordRepository.deleteByFlagFlagId(flagId)

        flagRepository.deleteById(flagId)
        sseService.sendData(
            SseDto(
                "",
                SseDto.SseType.DELETE,
                FlagTitleResponseDto(flag.title)
            )
        )

        return flag.flagId ?: throw BaseException(ResponseCode.FLAG_NOT_FOUND)
    }

    fun switchFlag(flagId: Long, switchRequestDto: SwitchRequestDto): Boolean {
        val flag = flagRepository.findById(flagId).get()
        flag.active = !switchRequestDto.active

        sseService.sendData(
            SseDto(
                "",
                SseDto.SseType.SWITCH,
                FlagIdResponseDto(flag.title, flag.active)
            )
        )

        return flag.active
    }

    /*
    * Todo
    *  Frontend -> Backend 변경된 것만 보내고, Backend에서도 변경된 것만 Update 하도록 수정
    *  현재 구현 방식은 Variation이 변경될 경우 기존의 모든 Variations를 Soft Delete 진행 후 새로 생성
    *  이는 Variation이 많아질 경우 성능 이슈가 발생할 수 있음
    *  Variation ID를 추가하여 변경된 것만 Update 하는 방식으로 수정 할 필요 있음. (추후 논의)
    *
    *  (Answer) : 그냥 Hard Delete 후 새로 생성하는 방식으로 변경
    * */
    @Transactional
    fun updateFlag(flagId: Long, flagRequestDto: FlagRequestDto): FlagResponseDto {
        val flag = flagRepository.findById(flagId).get()

        flag.title = flagRequestDto.title
        flag.type = flagRequestDto.type
        flag.description = flagRequestDto.description

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
            variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)

        defaultVariation.value = flagRequestDto.defaultValue
        defaultVariation.portion = flagRequestDto.defaultPortion
        defaultVariation.description = flagRequestDto.defaultDescription
        variationRepository.save(defaultVariation)

        variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag).map {
            it.delete()
        }


        // TODO... variations 수정 history 저장
        flagRequestDto.variations.map {
            val updatedVariation = Variation(
                flag = flag,
                description = it.description,
                portion = it.portion,
                value = it.value,
            )
            variationRepository.save(updatedVariation)
        }

        // keyword, property 저장
        flag.keywords.map { k ->
            k.properties.map { p ->
                p.delete()
            }
            k.properties.clear()
            k.delete()
        }
        flag.keywords.clear()
        val updatedKeywordList = mutableListOf<Keyword>()
        val keywordList = flagRequestDto.keywords
        for (keyword in keywordList) {
            val updatedPropertyList = mutableListOf<Property>()

            val savedKeyword = keywordRepository.save(
                Keyword(
                    flag = flag,
                    description = keyword.description,
                    value = keyword.value,
                )
            )
            updatedKeywordList.add(savedKeyword)

            for (property in keyword.properties) {
                val savedProperty = propertyRepository.save(
                    Property(
                        keyword = savedKeyword,
                        property = property.property,
                        data = property.data,
                    )
                )
                updatedPropertyList.add(savedProperty)
            }

            savedKeyword.properties.addAll(updatedPropertyList)
            keywordRepository.save(savedKeyword)
        }
        flag.keywords.addAll(updatedKeywordList)

        // SSE 전송
        val flagInitResponseDto = FlagInitResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            description = flag.description,
            type = flag.type,
            keywords = flag.keywords.map { k ->
                KeywordDto(
                    properties = k.properties.map { p ->
                        PropertyDto(
                            property = p.property,
                            data = p.data,
                        )
                    },
                    description = k.description,
                    value = k.value,
                )
            },
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
            variations = flagRequestDto.variations,
            maintainerId = flag.maintainer.memberId!!,
            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),
            deleteAt = flag.deletedAt.toString(),
            active = flag.active,
        )

        sseService.sendData(SseDto("", SseDto.SseType.UPDATE, flagInitResponseDto))

        return this.getFlag(flag.flagId!!)
    }

    @Transactional
    fun updateFlagInfo(flagId: Long, flagInfoRequestDto: FlagInfoRequestDto): FlagResponseDto {
        val flag = flagRepository.findById(flagId).get()
        flag.title = flagInfoRequestDto.title
        flag.description = flagInfoRequestDto.description
        val save = flagRepository.save(flag)

        // SSE
        val flagInitResponseDto = buildSSEData(save)
        sseService.sendData(SseDto("", SseDto.SseType.UPDATE, flagInitResponseDto))

        return this.getFlag(flag.flagId!!)
    }

    @Transactional
    fun updateVariationInfo(
        flagId: Long,
        variationInfoRequestDto: VariationInfoRequestDto
    ): FlagResponseDto {

        val flag = flagRepository.findById(flagId).get()
        flag.type = variationInfoRequestDto.type
        flagRepository.save(flag)

        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        defaultVariation.value = variationInfoRequestDto.defaultValue
        defaultVariation.portion = variationInfoRequestDto.defaultPortion
        defaultVariation.description = variationInfoRequestDto.defaultDescription
        variationRepository.save(defaultVariation)

        variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag).map {
            it.delete()
        }
        variationInfoRequestDto.variations.map {
            val updatedVariation = Variation(
                flag = flag,
                description = it.description,
                portion = it.portion,
                value = it.value,
            )
            variationRepository.save(updatedVariation)
        }
        val variations =
            variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)

        // SSE
        val flagInitResponseDto = FlagInitResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            description = flag.description,
            type = flag.type,
            keywords = flag.keywords.map { k ->
                KeywordDto(
                    properties = k.properties.map { p ->
                        PropertyDto(
                            property = p.property,
                            data = p.data,
                        )
                    },
                    description = k.description,
                    value = k.value,
                )
            },
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
            variations = variations.map {
                VariationDto(
                    null,
                    it.value,
                    it.portion,
                    it.description
                )
            },
            maintainerId = flag.maintainer.memberId!!,
            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),
            deleteAt = flag.deletedAt.toString(),
            active = flag.active,
        )

        sseService.sendData(SseDto("", SseDto.SseType.UPDATE, flagInitResponseDto))
        return this.getFlag(flag.flagId!!)
    }

    @Transactional
    fun updateVariationInfoWithHardDelete(
        flagId: Long,
        variationInfoRequestDto: VariationInfoRequestDto
    ): FlagResponseDto {

        val flag = flagRepository.findById(flagId).get()
        flag.type = variationInfoRequestDto.type

        val variations = variationRepository.findByFlagFlagId(flagId)
        val default = variations.first { it.defaultFlag }
        default.value = variationInfoRequestDto.defaultValue
        default.portion = variationInfoRequestDto.defaultPortion
        default.description = variationInfoRequestDto.defaultDescription

        val elseVariations = variations.filterNot { it.defaultFlag }.toMutableList()

        val existingVariations = mutableListOf<Variation>()
        existingVariations.addAll(elseVariations)
        elseVariations.clear()

        variationInfoRequestDto.variations.forEach { variationDto ->
            var matchVariation = false;
            for (variation in existingVariations) {
                if (variationDto.variationId == variation.variationId) {
                    matchVariation = true
                    variation.value = variationDto.value
                    variation.portion = variationDto.portion
                    variation.description = variationDto.description
                    existingVariations.remove(variation)
                    elseVariations.add(variation)
                    break
                }
            }
            if (!matchVariation) {
                variationRepository.save(variationDto.toEntity(flag))
            }
        }
        existingVariations.forEach { variation ->
            if (elseVariations.contains(variation).not()) {
                variationRepository.delete(variation)
            }
        }

        return FlagResponseDto(flag)
    }

    fun sendSse(
        flagResponseDto: FlagResponseDto
    ) {
        val flagInitResponseDto = buildSSEData(flagResponseDto)
        sseService.sendData(SseDto("", SseDto.SseType.UPDATE, flagInitResponseDto))
    }

    @Transactional
    fun updateKeywordInfo(
        flagId: Long,
        keywordInfoRequestDto: KeywordInfoRequestDto
    ): FlagResponseDto {

        val flag = flagRepository.findById(flagId).get()
        flag.keywords.map { k ->
            k.properties.map { p ->
                p.delete()
            }
            k.properties.clear()
            k.delete()
        }
        flag.keywords.clear()

        val updatedKeywordList = mutableListOf<Keyword>()
        for (keyword in keywordInfoRequestDto.keywords) {
            val updatedPropertyList = mutableListOf<Property>()

            val savedKeyword = keywordRepository.save(
                Keyword(
                    flag = flag,
                    description = keyword.description,
                    value = keyword.value,
                )
            )
            updatedKeywordList.add(savedKeyword)

            for (property in keyword.properties) {
                val savedProperty = propertyRepository.save(
                    Property(
                        keyword = savedKeyword,
                        property = property.property,
                        data = property.data,
                    )
                )
                updatedPropertyList.add(savedProperty)
            }

            savedKeyword.properties.addAll(updatedPropertyList)
            keywordRepository.save(savedKeyword)
        }
        flag.keywords.addAll(updatedKeywordList)

        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)
        val variations =
            variationRepository.findByFlagAndDefaultFlagIsFalseAndDeletedAtIsNull(flag)
        // SSE
        val flagInitResponseDto = FlagInitResponseDto(
            flagId = flag.flagId!!,
            title = flag.title,
            description = flag.description,
            type = flag.type,
            keywords = flag.keywords.map { k ->
                KeywordDto(
                    properties = k.properties.map { p ->
                        PropertyDto(
                            property = p.property,
                            data = p.data,
                        )
                    },
                    description = k.description,
                    value = k.value,
                )
            },
            defaultValue = defaultVariation.value,
            defaultPortion = defaultVariation.portion,
            defaultDescription = defaultVariation.description,
            variations = variations.map {
                VariationDto(
                    null,
                    it.value,
                    it.portion,
                    it.description
                )
            },
            maintainerId = flag.maintainer.memberId!!,
            createdAt = flag.createdAt.toString(),
            updatedAt = flag.updatedAt.toString(),
            deleteAt = flag.deletedAt.toString(),
            active = flag.active,
        )

        sseService.sendData(SseDto("", SseDto.SseType.UPDATE, flagInitResponseDto))
        return this.getFlag(flag.flagId!!)
    }

    @Transactional
    fun updateKeywordInfoWithHardDelete(
        flagId: Long,
        keywordInfoRequestDto: KeywordInfoRequestDto
    ): FlagResponseDto {

        val flag = flagRepository.findById(flagId).get()
        val existingKeywords = mutableListOf<Keyword>()
        existingKeywords.addAll(flag.keywords)
        flag.keywords.clear()

        keywordInfoRequestDto.keywords.forEach { keywordDto: KeywordDto ->
            var matchKeyword = false
            for (keyword in existingKeywords) {
                if (keyword.keywordId == keywordDto.keywordId) {
                    matchKeyword = true
                    keyword.description = keywordDto.description
                    keyword.value = keywordDto.value
                    checkProperty(keywordDto, keyword)
                    existingKeywords.remove(keyword)
                    flag.keywords.add(keyword)
                    break
                }
            }
            if (!matchKeyword) {
                val newKeyword = Keyword(
                    null,
                    flag,
                    mutableListOf(),
                    keywordDto.description,
                    keywordDto.value
                )

                keywordDto.properties.forEach { propertyDto: PropertyDto ->
                    newKeyword.properties.add(
                        propertyRepository.save(
                            Property(
                                null,
                                propertyDto.property,
                                propertyDto.data,
                                newKeyword
                            )
                        )
                    )
                }

                flag.keywords.add(newKeyword)
            }
        }

        existingKeywords.forEach { keyword ->
            if (flag.keywords.contains(keyword).not()) {
                keywordRepository.delete(keyword)
            }
        }
        return FlagResponseDto(flag)
    }

    private fun checkProperty(
        keywordDto: KeywordDto,
        keyword: Keyword
    ) {
        val existingProperties = mutableListOf<Property>()
        existingProperties.addAll(keyword.properties)
        keyword.properties.clear()

        keywordDto.properties.forEach { propertyDto ->
            var matchProperty = false
            for (property in existingProperties) {
                if (property.propertyId == propertyDto.propertyId) {
                    matchProperty = true
                    property.property = propertyDto.property
                    property.data = propertyDto.data
                    existingProperties.remove(property)
                    keyword.properties.add(property)
                    break
                }
            }
            if (!matchProperty) {
                keyword.properties.add(
                    propertyRepository.save(
                        Property(
                            null,
                            propertyDto.property,
                            propertyDto.data,
                            keyword
                        )
                    )
                )
            }
        }
        existingProperties.forEach { property ->
            if (keyword.properties.contains(property).not()) {
                propertyRepository.delete(property)
            }
        }
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
        val sdkKey = oraganizationService.getSdkKey();
        if (sdkKey != flagInitRequestDto.sdkKey) {
            throw BaseException(ResponseCode.SDK_KEY_NOT_FOUND)
        }
        val flagList = flagRepository.findAll()

        return flagList.map { flag ->
            val allVariation = variationRepository.findByFlagAndDeletedAtIsNull(flag)
            var defaultValue = ""
            var defaultPortion = 0
            var defaultDescription = ""
            var variations = listOf<VariationDto>()

            allVariation.map { variation ->
                if (variation.defaultFlag) {
                    defaultValue = variation.value
                    defaultPortion = variation.portion
                    defaultDescription = variation.description
                } else {
                    variations += VariationDto(
                        value = variation.value,
                        portion = variation.portion,
                        description = variation.description
                    )
                }
            }

            FlagInitResponseDto(
                flagId = flag.flagId!!,
                title = flag.title,
                description = flag.description,
                type = flag.type,
                keywords = flag.keywords.map { k ->
                    KeywordDto(
                        properties = k.properties.map { p ->
                            PropertyDto(
                                property = p.property,
                                data = p.data,
                            )
                        },
                        description = k.description,
                        value = k.value,
                    )
                },
                defaultValue = defaultValue,
                defaultPortion = defaultPortion,
                defaultDescription = defaultDescription,
                variations = variations,
                maintainerId = flag.maintainer.memberId!!,
                createdAt = flag.createdAt.toString(),
                updatedAt = flag.updatedAt.toString(),
                deleteAt = flag.deletedAt.toString(),
                active = flag.active,
            )
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

                maintainerName = "${flag.maintainer.firstName} ${flag.maintainer.lastName}",
            )
        }
    }

    fun getHistoriesOverview(): List<HistoryResponse> {
        return historyRepository.findAllByLimit(3)
    }
}