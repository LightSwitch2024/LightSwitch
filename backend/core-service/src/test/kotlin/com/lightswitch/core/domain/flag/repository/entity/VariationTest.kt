package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class VariationTest {
    @Autowired
    private lateinit var variationRepository: VariationRepository

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Test
    fun `variation 저장 테스트`() {
        flagRepository.deleteAll()
        variationRepository.deleteAll()

        val flag = Flag(
            title = "test",
            description = "test test",
            maintainerId = 1L,
            type = "BOOLEAN",
        )
        val savedFlag= flagRepository.save(flag)

        val variationOfTrue = Variation(
            flagId = savedFlag,
            portion = 100,
            description = "test",
            variationType = "BOOLEAN",
            value = "TRUE",
        )

        val variationOfFalse = Variation(
            flagId = savedFlag,
            portion = 0,
            description = "test",
            variationType = "BOOLEAN",
            value = "FALSE",
        )

        variationRepository.save(variationOfTrue)
        variationRepository.save(variationOfFalse)
    }
}