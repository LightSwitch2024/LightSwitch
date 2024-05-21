package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.entity.Tag
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class TagServiceTest(
    @Autowired
    private val tagService: TagService,

    @Autowired
    private val tagRepository: TagRepository
) {

    @Test
    fun `전체 tag 조회 테스트`() {
        // given

        // when
        val tagList = tagService.getAllTags()
        val numberOfAllTags = tagRepository.countBy()

        // then
        assertThat(tagList.size).isEqualTo(numberOfAllTags)
    }

    @Test
    fun `content로 조회한 tag 테스트 _ 부분일치 검색`() {
        // given
        val tag1 = Tag(
            colorHex = "#FFFFFF",
            content = "test1234"
        )

        val tag2 = Tag(
            colorHex = "#000000",
            content = "testing"
        )

        val tag3 = Tag(
            colorHex = "#000000",
            content = "tag"
        )
        tagRepository.saveAll(listOf(tag1, tag2, tag3))

        val content1 = "tag"
        val content2 = "test"
        // when
        val tagList1 = tagService.getTagByContent(content1)
        val tagList2 = tagService.getTagByContent(content2)

        val regex1 = ".*tag.*".toRegex()
        val result1 = tagRepository.findAll().filter { regex1.containsMatchIn(it.content) }

        val regex2 = ".*test.*".toRegex()
        val result2 = tagRepository.findAll().filter { regex2.containsMatchIn(it.content) }

        // then
        assertThat(tagList1.size).isEqualTo(result1.size)
        assertThat(tagList2.size).isEqualTo(result2.size)
        tagList1.map {
            assertThat(it.content).contains(content1)
        }
        tagList2.map {
            assertThat(it.content).contains(content2)
        }
    }
}