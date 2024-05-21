package com.lightswitch.core.domain.flag.repository.queydsl

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.flag.repository.entity.Tag
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class FlagCustomRepositoryImplTest(
    @Autowired
    private val flagCustomRepositoryImpl: FlagCustomRepositoryImpl,

    @Autowired
    private val flagRepository: FlagRepository,

    @Autowired
    private val tagRepository: TagRepository,

    @Autowired
    private val memberRepository: MemberRepository,
) {

    private var flag: Flag? = null
    private var flag2: Flag? = null
    private var flag3: Flag? = null
    private var flag4: Flag? = null
    private var tag: Tag? = null
    private var tag2: Tag? = null
    private var tag3: Tag? = null
    private var tag4: Tag? = null

    @BeforeEach
    fun setUp() {

        val savedMember = memberRepository.findByEmailAndDeletedAtIsNull("test@gmail.com") ?: let {
            memberRepository.save(
                Member(
                    lastName = "test",
                    firstName = "test",
                    telNumber = "01012345678",
                    email = "test@gmail.com",
                    password = "test",
                )
            )
        }

        flag = Flag(
            title = "test",
            description = "test test",
            maintainer = savedMember,
            type = FlagType.BOOLEAN,
        )

        flag2 = Flag(
            title = "test2",
            description = "test2 test2",
            maintainer = savedMember,
            type = FlagType.BOOLEAN,
        )

        flag3 = Flag(
            title = "test3",
            description = "test3 test3",
            maintainer = savedMember,
            type = FlagType.BOOLEAN,
        )

        flag4 = Flag(
            title = "test4",
            description = "test4 test4",
            maintainer = savedMember,
            type = FlagType.BOOLEAN,
        )

        tag = Tag(
            colorHex = "#FFFFFF",
            content = "v1.0"
        )

        tag2 = Tag(
            colorHex = "#000000",
            content = "v2.0"
        )

        tag3 = Tag(
            colorHex = "#FFFFFF",
            content = "UI"
        )

        tag4 = Tag(
            colorHex = "#000000",
            content = "UX"
        )
    }

    @Test
    @DisplayName("findByTagContents")
    fun `플래그 다중 필터링 테스트`() {

        val savedFlags: List<Flag> = flagRepository.saveAll(listOf(flag!!, flag2!!, flag3!!, flag4!!))
        val savedTags: List<Tag> = tagRepository.saveAll(listOf(tag!!, tag2!!, tag3!!, tag4!!))

        savedFlags[0].tags.addAll(listOf(savedTags[0], savedTags[1], savedTags[2], savedTags[3]))
        savedFlags[1].tags.addAll(listOf(savedTags[1], savedTags[2]))
        savedFlags[2].tags.addAll(listOf(savedTags[2], savedTags[3]))
        savedFlags[3].tags.addAll(listOf(savedTags[3]))

        flagRepository.saveAll(savedFlags)

        val result = flagCustomRepositoryImpl.findByTagContents(listOf(savedTags[3].content))
        assertThat(result).hasSize(3)

        val result2 = flagCustomRepositoryImpl.findByTagContents(listOf(savedTags[0].content))
        assertThat(result2).hasSize(1)

        val result3 = flagCustomRepositoryImpl.findByTagContents(
            listOf(
                savedTags[0].content,
                savedTags[1].content
            )
        )
        assertThat(result3).hasSize(1)

        val result4 = flagCustomRepositoryImpl.findByTagContents(
            listOf(
                savedTags[1].content,
                savedTags[2].content
            )
        )
        assertThat(result4).hasSize(2)

        val result5 = flagCustomRepositoryImpl.findByTagContents(
            listOf(
                savedTags[2].content,
                savedTags[3].content
            )
        )
        assertThat(result5).hasSize(2)

        val result6 = flagCustomRepositoryImpl.findByTagContents(listOf(savedTags[2].content))
        assertThat(result6).hasSize(3)
    }
}