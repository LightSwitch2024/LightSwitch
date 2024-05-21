package com.lightswitch.core.domain.history.service

import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.PropertyDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.*
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Keyword
import com.lightswitch.core.domain.flag.repository.entity.Variation
import com.lightswitch.core.domain.history.dto.PreFlag
import com.lightswitch.core.domain.history.dto.PreKeyword
import com.lightswitch.core.domain.history.dto.PreVariation
import com.lightswitch.core.domain.history.repository.HistoryRepository
import com.lightswitch.core.domain.history.repository.entity.History
import com.lightswitch.core.domain.history.repository.entity.HistoryType
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.AfterReturning
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Aspect
@Service
class HistoryService(
    @Autowired
    private var historyRepository: HistoryRepository,

    @Autowired
    private var flagRepository: FlagRepository,

    @Autowired
    private var variationRepository: VariationRepository
) {

    @AfterReturning(
        pointcut = "execution(* com.lightswitch.core.domain.flag.service.FlagService.createFlag(..))",
        returning = "flagResponseDto"
    )
    fun createFlag(flagResponseDto: FlagResponseDto) {

        val flagId = flagResponseDto.flagId
        val flag = flagRepository.findById(flagId!!).orElseThrow()

        val flagHistory = History(
            flag = flag,
            action = HistoryType.CREATE_FLAG,
            current = flagResponseDto.title
        )
        historyRepository.save(flagHistory)


        val defaultValueHistory = History(
            flag = flag,
            action = HistoryType.CREATE_VARIATION,
            current = flagResponseDto.defaultValue
        )
        historyRepository.save(defaultValueHistory)


        flagResponseDto.variations?.forEach { variationDto: VariationDto ->
            val variationHistory = History(
                flag = flag,
                action = HistoryType.CREATE_VARIATION,
                current = variationDto.value
            )
            historyRepository.save(variationHistory)
        }

        flagResponseDto.keywords.forEach { keywordDto: KeywordDto ->
            val keywordHistory = History(
                flag = flag,
                action = HistoryType.CREATE_KEYWORD,
                current = keywordDto.description
            )
            historyRepository.save(keywordHistory)

            keywordDto.properties.forEach { propertyDto: PropertyDto ->
                val propertyHistory = History(
                    flag = flag,
                    action = HistoryType.CREATE_PROPERTY,
                    target = keywordDto.description,
                    current = propertyDto.property
                )
                historyRepository.save(propertyHistory)
            }
        }
    }

    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.switchFlag(..)) && args(flagId,switchRequestDto)")
    fun switchFlag(proceedingJoinPoint: ProceedingJoinPoint, flagId: Long, switchRequestDto: SwitchRequestDto): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        val preFlag = flag.toPrevious()
        val proceed = proceedingJoinPoint.proceed()
        historyRepository.save(
            History(
                flag = flag,
                action = HistoryType.SWITCH_FLAG,
                previous = preFlag.active.toString(),
                current = switchRequestDto.active.toString()
            )
        )
        return proceed;
    }

    //    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateFlag(..)) && args(flagId,flagRequestDto)")
    fun updateFlag(proceedingJoinPoint: ProceedingJoinPoint, flagId: Long, flagRequestDto: FlagRequestDto): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        val preFlag = flag.toPrevious()
        val variations = variationRepository.findByFlagFlagId(flagId)
        val preVariation = variations.map { it.toPrevious() }
        val proceed = proceedingJoinPoint.proceed()
        checkFlagTitle(preFlag, flag)
        checkFlagType(preFlag, flag)
        checkVariation(flag, preVariation, variations)
        checkKeyword(preFlag, flag)

        return proceed;
    }

    private fun checkFlagType(
        preFlag: PreFlag,
        flag: Flag
    ) {
        if (preFlag.type != flag.type) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.UPDATE_FLAG_TYPE,
                    previous = preFlag.type.toString(),
                    current = flag.type.toString()
                )
            )
        }
    }

    private fun checkProperty(
        flag: Flag,
        preKeyword: PreKeyword,
        keyword: Keyword
    ) {
        val properties = keyword.properties
        val preProperties = preKeyword.properties

        for (property in properties) {
            var matchedProperty = false
            for (preProperty in preProperties) {
                if (property.propertyId == preProperty.propertyId) {
                    matchedProperty = true
                    if (property.property != preProperty.property) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_PROPERTY_KEY,
                                target = keyword.description,
                                previous = preProperty.property,
                                current = property.property
                            )
                        )
                    }
                    if (property.data != preProperty.data) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_PROPERTY_VALUE,
                                target = keyword.description,
                                previous = preProperty.data,
                                current = property.data
                            )
                        )
                    }
                }
            }
            if (!matchedProperty) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.CREATE_PROPERTY,
                        target = keyword.description,
                        current = property.property
                    )
                )
            }
        }

        preProperties.forEach { preProperty ->
            var stillExists = false
            for (property in properties) {
                if (preProperty.propertyId == property.propertyId && property.deletedAt == null) {
                    stillExists = true
                    break
                }
            }
            if (!stillExists) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.DELETE_PROPERTY,
                        previous = preProperty.property
                    )
                )
            }
        }

    }

    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateFlagInfo(..)) && args(flagId,flagInfoRequestDto)")
    fun updateFlagInfo(
        proceedingJoinPoint: ProceedingJoinPoint,
        flagId: Long,
        flagInfoRequestDto: FlagInfoRequestDto
    ): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        val preFlag = flag.toPrevious()
        val proceed = proceedingJoinPoint.proceed()

        checkFlagTitle(preFlag, flag)
        return proceed
    }

    private fun checkFlagTitle(
        preFlag: PreFlag,
        flag: Flag
    ) {
        if (preFlag.title != flag.title) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.UPDATE_FLAG_TITLE,
                    previous = preFlag.title,
                    current = flag.title
                )
            )
        }
    }

//    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateVariationInfo(..)) && args(flagId,variationInfoRequestDto)")
    fun updateVariationInfo(
        proceedingJoinPoint: ProceedingJoinPoint,
        flagId: Long,
        variationInfoRequestDto: VariationInfoRequestDto
    ): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        val variations = variationRepository.findByFlagFlagId(flagId)
        val preVariations = variations.map { it.toPrevious() }
        val proceed = proceedingJoinPoint.proceed()

        checkVariation(flag, preVariations, variations)

        return proceed
    }

    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateVariationInfoWithHardDelete(..)) && args(flagId,variationInfoRequestDto)")
    fun updateVariationInfoWithHardDelete(
        proceedingJoinPoint: ProceedingJoinPoint,
        flagId: Long,
        variationInfoRequestDto: VariationInfoRequestDto
    ): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        var variations = variationRepository.findByFlagAndDeletedAtIsNull(flag)
        val preVariations = variations.map { it.toPrevious() }
        val proceed = proceedingJoinPoint.proceed()
        variations = variationRepository.findByFlagAndDeletedAtIsNull(flag)
        checkVariation(flag, preVariations, variations)
        return proceed
    }


    private fun checkVariation(
        flag: Flag,
        preVariations: List<PreVariation>,
        variations: List<Variation>
    ) {

        variations.filter { it.deletedAt == null }.forEach { variation ->
            var matchedVariation = false
            for (preVariation in preVariations) {
                if (preVariation.variationId == variation.variationId) {
                    matchedVariation = true
                    if (preVariation.value != variation.value) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_VARIATION_VALUE,
                                previous = preVariation.value,
                                current = variation.value
                            )
                        )
                    }
                    if (preVariation.portion != variation.portion) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_VARIATION_PORTION,
                                target = variation.value,
                                previous = preVariation.portion.toString(),
                                current = variation.portion.toString()
                            )
                        )
                    }
                    break
                }
            }
            if (!matchedVariation) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.CREATE_VARIATION,
                        current = variation.value
                    )
                )
            }
        }

        preVariations.forEach { preVariation ->
            var stillExists = false
            for (variation in variations) {
                if (preVariation.variationId == variation.variationId && variation.deletedAt == null) {
                    stillExists = true
                    break
                }
            }
            if (!stillExists) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.DELETE_VARIATION,
                        previous = preVariation.value
                    )
                )
            }
        }
    }

    //    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateKeywordInfo(..)) && args(flagId,keywordInfoRequestDto)")
    fun updateKeywordInfo(
        proceedingJoinPoint: ProceedingJoinPoint,
        flagId: Long,
        keywordInfoRequestDto: KeywordInfoRequestDto
    ): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        val preFlag = flag.toPrevious()
        val proceed = proceedingJoinPoint.proceed()
        // keyword & property

        checkKeyword(preFlag, flag)

        return proceed
    }

    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateKeywordInfoWithHardDelete(..)) && args(flagId,keywordInfoRequestDto)")
    fun updateKeywordInfoWithHardDelete(
        proceedingJoinPoint: ProceedingJoinPoint,
        flagId: Long,
        keywordInfoRequestDto: KeywordInfoRequestDto
    ): Any? {
        val flag = flagRepository.findById(flagId).orElseThrow()
        val preFlag = flag.toPrevious()
        val proceed = proceedingJoinPoint.proceed()
        // keyword & property

        checkKeyword(preFlag, flag)

        return proceed
    }

    private fun checkKeyword(
        preFlag: PreFlag,
        flag: Flag
    ) {
        val keywords = flag.keywords
        val preKeywords = preFlag.keywords

        for (keyword in keywords) {
            var matchedKeyword = false
            for (preKeyword in preKeywords) {
                if (preKeyword.keywordId == keyword.keywordId) {
                    matchedKeyword = true
                    if (preKeyword.value != keyword.value) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_KEYWORD,
                                target = keyword.description,
                                previous = preKeyword.value,
                                current = keyword.value
                            )
                        )
                    }
                    checkProperty(flag, preKeyword, keyword)
                    break
                }
            }
            if (!matchedKeyword) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.CREATE_KEYWORD,
                        target = keyword.description,
                        current = keyword.value
                    )
                )
            }
        }

        preKeywords.forEach { preKeyword ->
            var stillExists = false
            for (keyword in keywords) {
                if (preKeyword.keywordId == keyword.keywordId && keyword.deletedAt == null) {
                    stillExists = true
                    break
                }
            }
            if (!stillExists) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.DELETE_KEYWORD,
                        previous = preKeyword.value
                    )
                )
            }
        }
    }

    //    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.deleteFlagWithHardDelete(..)) && args(flagId)")
    fun deleteFlagWithHardDelete(
        proceedingJoinPoint: ProceedingJoinPoint,
        flagId: Long,
    ): Any? {
        val proceed = proceedingJoinPoint.proceed()
        val flag = flagRepository.findById(flagId).orElseThrow()

        if (flag.deletedAt != null) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.DELETE_FLAG,
                    previous = flag.title
                )
            )
        }
        return proceed
    }
}