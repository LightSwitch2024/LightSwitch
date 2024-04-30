package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
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
            flag = savedFlag,
            portion = 100,
            description = "test",
            value = "TRUE",
        )

        val variationOfFalse = Variation(
            flag = savedFlag,
            portion = 0,
            description = "test",
            value = "FALSE",
        )

        // when
        variationRepository.save(variationOfTrue)
        variationRepository.save(variationOfFalse)

        // then
        assertNotNull(variationOfTrue.variationId)
        assertNotNull(variationOfFalse.variationId)
        assertEquals(variationOfTrue.portion + variationOfFalse.portion, 100)
        assertEquals(variationOfTrue.flag.flagId, savedFlag.flagId)
        assertEquals(variationOfFalse.flag.flagId, savedFlag.flagId)
    }
}