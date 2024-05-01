package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.repository.KeywordRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class KeywordTest {

    @Autowired
    private lateinit var keywordRepository: KeywordRepository

    @Test
    fun `keyword 저장 테스트`() {
        // given
        val keyword1 = Keyword(
            keyword = "test", description = "test"
        )

        val keyword2 = Keyword(
            keyword = "test2", description = "test2"
        )

        // when
        val keywordList = keywordRepository.saveAll(listOf(keyword1, keyword2))

        // then
        assertThat(keywordList).hasSize(2)
        assertThat(keywordList.first().keyword).isEqualTo("test")
        assertThat(keywordList.last().keyword).isEqualTo("test2")
    }

}