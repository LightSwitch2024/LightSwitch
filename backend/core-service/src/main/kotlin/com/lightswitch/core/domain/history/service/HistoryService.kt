package com.lightswitch.core.domain.history.service

import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.PropertyDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.SwitchRequestDto
import com.lightswitch.core.domain.flag.dto.res.FlagResponseDto
import com.lightswitch.core.domain.flag.repository.FlagRepository
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
    private var flagRepository: FlagRepository
) {

    @AfterReturning(
        pointcut = "execution(* com.lightswitch.core.domain.flag.service.FlagService.createFlag(..))",
        returning = "flagResponseDto"
    )
    fun createFlag(flagResponseDto: FlagResponseDto) {

        print("=== create history ===")
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
                current = switchRequestDto.active.toString()
            )
        )
        return proceed;
    }


}