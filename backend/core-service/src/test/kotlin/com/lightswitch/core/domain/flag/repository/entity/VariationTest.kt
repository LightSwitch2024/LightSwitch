package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
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
        // given
        val flag = Flag(
            title = "test",
            description = "test test",
            maintainerId = 1,
            type = FlagType.BOOLEAN,
        )
        val savedFlag = flagRepository.save(flag)

        val variationOfTrue = Variation(
            flagId = savedFlag,
            portion = 100,
            description = "test",
            variationType = FlagType.BOOLEAN,
            value = "TRUE",
        )

        val variationOfFalse = Variation(
            flagId = savedFlag,
            portion = 0,
            description = "test",
            variationType = FlagType.BOOLEAN,
            value = "FALSE",
        )

        // when
        variationRepository.save(variationOfTrue)
        variationRepository.save(variationOfFalse)

        // then
        assertNotNull(variationOfTrue.variationId)
        assertNotNull(variationOfFalse.variationId)
        assertEquals(variationOfTrue.portion + variationOfFalse.portion, 100)
        assertEquals(variationOfTrue.flagId, savedFlag)
        assertEquals(variationOfFalse.flagId, savedFlag)
    }
}