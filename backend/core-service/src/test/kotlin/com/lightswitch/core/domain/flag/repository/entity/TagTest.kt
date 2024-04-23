package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class TagTest {

    @Autowired
    private lateinit var tagRepository: TagRepository

    @Test
    fun `tag 저장 테스트`() {
        tagRepository.deleteAll()

        val tag1 = Tag(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = Tag(
            colorHex = "#000000",
            content = "test2"
        )

        tagRepository.saveAll(listOf(tag1, tag2))
    }
}