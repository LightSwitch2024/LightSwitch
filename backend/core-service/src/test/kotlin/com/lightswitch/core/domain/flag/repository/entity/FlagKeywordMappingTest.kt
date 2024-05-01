package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagKeywordMappingRepository
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.KeywordRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class FlagKeywordMappingTest {

    @Autowired
    private lateinit var flagKeywordMappingRepository: FlagKeywordMappingRepository

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var keywordRepository: KeywordRepository

    @Autowired
    private lateinit var variationRepository: VariationRepository

    @Test
    fun `FlagKeywordMapping 저장 테스트`() {

        var flag = Flag(
            title = "test",
            description = "test test",
            maintainerId = 1,
            type = FlagType.BOOLEAN,
        )
        val savedFlag = flagRepository.save(flag)

        var keyword1 = Keyword(
            keyword = "test", description = "test"
        )
        var keyword2 = Keyword(
            keyword = "test2", description = "test2"
        )
        val keywordList = keywordRepository.saveAll(listOf(keyword1, keyword2))

        val flagKeywordMapping = FlagKeywordMapping(
            flag = savedFlag,
            keywords = keywordList,
        )
        val savedFlagKeywordMapping = flagKeywordMappingRepository.save(flagKeywordMapping)

        assertThat(savedFlagKeywordMapping.flag).isEqualTo(savedFlag)
        assertThat(savedFlagKeywordMapping.keywords).hasSize(2)
        assertThat(savedFlagKeywordMapping.keywords.first().keyword).isEqualTo("test")
        assertThat(savedFlagKeywordMapping.keywords.last().keyword).isEqualTo("test2")
    }

    @Test
    fun `FlagKeywordMapping 포함 Variation 테스트`() {
        var flag = Flag(
            title = "test",
            description = "test test",
            maintainerId = 1,
            type = FlagType.BOOLEAN,
        )
        val savedFlag = flagRepository.save(flag)

        var keyword1 = Keyword(
            keyword = "test", description = "test"
        )
        var keyword2 = Keyword(
            keyword = "test2", description = "test2"
        )
        val keywordList = keywordRepository.saveAll(listOf(keyword1, keyword2))

        val flagKeywordMapping = FlagKeywordMapping(
            flag = savedFlag,
            keywords = keywordList,
        )
        val savedFlagKeywordMapping = flagKeywordMappingRepository.save(flagKeywordMapping)

        val variation = Variation(
            flag = savedFlag,
            portion = 100,
            description = "test",
            value = "TRUE",
            flagKeywordMapping = savedFlagKeywordMapping,
        )
        val savedVariation = variationRepository.save(variation)

        assertThat(savedVariation.flag).isEqualTo(savedFlag)
        assertThat(savedVariation.flagKeywordMapping).isEqualTo(savedFlagKeywordMapping)
    }
}