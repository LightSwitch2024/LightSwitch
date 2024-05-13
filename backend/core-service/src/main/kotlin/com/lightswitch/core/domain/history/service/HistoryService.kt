package com.lightswitch.core.domain.history.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.PropertyDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.req.SwitchRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Keyword
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

        val flagHistory: History
        val flag = flagRepository.findById(flagResponseDto.flagId).orElseThrow()

        flagHistory = History(
            flag = flag,
            action = HistoryType.CREATE_FLAG,
            current = flagResponseDto.title
        )
        historyRepository.save(flagHistory)

        flagResponseDto.variations.forEach { variationDto: VariationDto ->
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
        val proceed = proceedingJoinPoint.proceed()
        val flag = flagRepository.findById(flagId).orElseThrow()
        historyRepository.save(
            History(
                flag = flag,
                action = HistoryType.SWITCH_FLAG,
                previous = flag.active.toString(),
                current = switchRequestDto.active.toString()
            )
        )
        return proceed;
    }

    @Around("execution(* com.lightswitch.core.domain.flag.service.FlagService.updateFlag(..)) && args(flagId,flagRequestDto)")
    fun updateFlag(proceedingJoinPoint: ProceedingJoinPoint, flagId: Long, flagRequestDto: FlagRequestDto): Any? {
        val proceed = proceedingJoinPoint.proceed()
        val flag = flagRepository.findById(flagId).orElseThrow()

        if (flag.title != flagRequestDto.title) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.UPDATE_FLAG_TITLE,
                    previous = flag.title,
                    current = flagRequestDto.title
                )
            )
        }

        if (flag.type != flagRequestDto.type) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.UPDATE_FLAG_TYPE,
                    previous = flag.type.toString(),
                    current = flagRequestDto.type.toString()
                )
            )
        }

        val defaultVariation =
            variationRepository.findByFlagAndDefaultFlagIsTrueAndDeletedAtIsNull(flag)
                ?: throw BaseException(ResponseCode.VARIATION_NOT_FOUND)

        if (defaultVariation.value != flagRequestDto.defaultValue) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.UPDATE_VARIATION_VALUE,
                    previous = defaultVariation.value,
                    current = flagRequestDto.defaultValue
                )
            )
        }

        if (defaultVariation.portion != flagRequestDto.defaultPortion) {
            historyRepository.save(
                History(
                    flag = flag,
                    action = HistoryType.UPDATE_VARIATION_PORTION,
                    previous = defaultVariation.portion.toString(),
                    current = flagRequestDto.defaultPortion.toString()
                )
            )
        }


        // keyword & property
        for (keywordDto in flagRequestDto.keywords) {
            var matchedKeyword = false
            for (keyword in flag.keywords) {
                if (keyword.keywordId == keywordDto.keywordId) {
                    matchedKeyword = true
                    if (keyword.value != keywordDto.value) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_KEYWORD,
                                target = keywordDto.description,
                                previous = keyword.value,
                                current = keywordDto.value
                            )
                        )
                    }
                    checkProperty(keywordDto, keyword, flag)
                    break
                }
            }
            if (!matchedKeyword) {
                historyRepository.save(
                    History(
                        flag = flag,
                        action = HistoryType.CREATE_KEYWORD,
                        target = keywordDto.description,
                        current = keywordDto.value
                    )
                )
            }
        }

        return proceed;
    }

    private fun checkProperty(
        keywordDto: KeywordDto,
        keyword: Keyword,
        flag: Flag
    ) {
        for (propertyDto in keywordDto.properties) {
            var matchedProperty = false
            for (property in keyword.properties) {
                if (propertyDto.propertyId == property.propertyId) {
                    matchedProperty = true
                    if (propertyDto.property != property.property) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_PROPERTY_KEY,
                                target = keywordDto.description,
                                previous = property.property,
                                current = propertyDto.property
                            )
                        )
                    }
                    if (propertyDto.data != property.data) {
                        historyRepository.save(
                            History(
                                flag = flag,
                                action = HistoryType.UPDATE_PROPERTY_VALUE,
                                target = keywordDto.description,
                                previous = property.data,
                                current = propertyDto.data
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
                        target = keywordDto.description,
                        current = propertyDto.property
                    )
                )
            }
        }
    }

}