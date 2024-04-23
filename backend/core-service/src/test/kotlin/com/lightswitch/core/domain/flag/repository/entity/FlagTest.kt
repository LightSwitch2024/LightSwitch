package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.VariationRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension

@SpringBootTest
class FlagTest {

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var tagRepository: TagRepository

    @Autowired
    private lateinit var variationRepository: VariationRepository

    @Test
    fun setUp() {
        flagRepository.deleteAll()
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

    @Test
    fun `Flag Entity + Tag Entity + Variation Entity 테스트` () {
        // setup
        flagRepository.deleteAll()
        tagRepository.deleteAll()
        variationRepository.deleteAll()

        // given + when
        // tag 저장
        val tag1 = Tag(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = Tag(
            colorHex = "#000000",
            content = "test2"
        )

        tagRepository.saveAll(listOf(tag1, tag2))

        // flag 저장
        val flag = Flag(
            title = "test",
            description = "test test",
            tags = mutableListOf(tag1, tag2),
            maintainerId = 1L,
            type = "BOOLEAN",
        )
        val savedFlag = flagRepository.save(flag)

        // variation 저장
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

        // then
        val foundFlag = flagRepository.findById(savedFlag.flagId!!)
        assertNotNull(foundFlag)
        assertEquals(savedFlag.title, foundFlag.get().title)
        assertEquals(savedFlag.description, foundFlag.get().description)

        val foundTag1 = tagRepository.findById(tag1.tagId!!)
        assertNotNull(foundTag1)
        assertEquals(tag1.colorHex, foundTag1.get().colorHex)
        assertEquals(tag1.content, foundTag1.get().content)
        val foundTag2 = tagRepository.findById(tag2.tagId!!)
        assertNotNull(foundTag2)
        assertEquals(tag2.colorHex, foundTag2.get().colorHex)
        assertEquals(tag2.content, foundTag2.get().content)

        val foundVariationOfTrue = variationRepository.findById(variationOfTrue.variationId!!)
        assertNotNull(foundVariationOfTrue)
        assertEquals(variationOfTrue.portion, foundVariationOfTrue.get().portion)
        assertEquals(variationOfTrue.description, foundVariationOfTrue.get().description)
        assertEquals(variationOfTrue.variationType, foundVariationOfTrue.get().variationType)
        assertEquals(variationOfTrue.value, foundVariationOfTrue.get().value)

        val foundVariationOfFalse = variationRepository.findById(variationOfFalse.variationId!!)
        assertNotNull(foundVariationOfFalse)
        assertEquals(variationOfFalse.portion, foundVariationOfFalse.get().portion)
        assertEquals(variationOfFalse.description, foundVariationOfFalse.get().description)
        assertEquals(variationOfFalse.variationType, foundVariationOfFalse.get().variationType)
        assertEquals(variationOfFalse.value, foundVariationOfFalse.get().value)
    }
}