package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.repository.TagRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.test.context.ActiveProfiles

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class TagRepositoryIntegrationTest(
    @Autowired
    val entityManager: TestEntityManager,

    @Autowired
    val tagRepository: TagRepository
) {


    @Test
    fun `tag 저장 테스트`() {
        // given
        val tag1 = Tag(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = Tag(
            colorHex = "#000000",
            content = "test2"
        )

        // when
        entityManager.persist(tag1)
        entityManager.persist(tag2)
        entityManager.flush()

        // then
        val tagList = tagRepository.findAll()
        assertEquals(2, tagList.size)
        assertNotNull(tagList[0].content)
        assertNotNull(tagList[1].content)
    }

    @Test
    fun `tag content 기반 조회 테스트`() {
        // given
        val tag1 = Tag(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = Tag(
            colorHex = "#000000",
            content = "test2"
        )

        entityManager.persist(tag1)
        entityManager.persist(tag2)
        entityManager.flush()

        // when
        val foundTag = tagRepository.findByContent("test")

        // then
        assertEquals("test", foundTag?.content)
    }
}