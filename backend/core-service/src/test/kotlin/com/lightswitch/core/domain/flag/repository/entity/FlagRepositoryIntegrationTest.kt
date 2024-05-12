package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional

@Transactional
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class FlagRepositoryIntegrationTest(
    @Autowired
    val entityManager: TestEntityManager,

    @Autowired
    val flagRepository: FlagRepository,

    @Autowired
    val tagRepository: TagRepository,

    @Autowired
    val memberRepository: MemberRepository
) {
    var member: Member? = null

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
        member = savedMember

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
    fun `Flag Entity 저장 테스트`() {
        // given + when
        // flag 저장
        val flag = Flag(
            title = "test",
            description = "test test",
            maintainer = member!!,
            type = FlagType.BOOLEAN,
            tags = mutableListOf(),
            keywords = mutableListOf(),
        )
        entityManager.persist(flag)
        entityManager.flush()

        val savedFlag = flagRepository.findById(flag.flagId!!).get()

        assertTrue(savedFlag.flagId!! > 0)
        assertThat(savedFlag.title).isEqualTo(flag.title)
        assertThat(savedFlag.description).isEqualTo(flag.description)
        assertThat(savedFlag.maintainer).isEqualTo(flag.maintainer)
        assertThat(savedFlag.type).isEqualTo(flag.type)
        assertThat(savedFlag.tags).isEqualTo(flag.tags)
        assertThat(savedFlag.keywords).isEqualTo(flag.keywords)
    }

    @Test
    fun `Flag Entity 수정 테스트`() {
        // given
        val flag = Flag(
            title = "test",
            description = "test test",
            maintainer = member!!,
            type = FlagType.BOOLEAN,
            tags = mutableListOf(),
            keywords = mutableListOf(),
        )
        entityManager.persist(flag)
        entityManager.flush()

        // when
        val savedFlag = flagRepository.findById(flag.flagId!!).get()
        savedFlag.title = "test2"
        savedFlag.description = "test test2"

        entityManager.persist(savedFlag)
        entityManager.flush()

        // then
        val updatedFlag = flagRepository.findById(flag.flagId!!).get()
        assertThat(updatedFlag.title).isEqualTo("test2")
        assertThat(updatedFlag.description).isEqualTo("test test2")
    }

    @Test
    fun `Flag Entity 삭제 테스트`() {
        // given
        val flag = Flag(
            title = "test",
            description = "test test",
            maintainer = member!!,
            type = FlagType.BOOLEAN,
            tags = mutableListOf(),
            keywords = mutableListOf(),
        )
        entityManager.persist(flag)
        entityManager.flush()

        // when
        flagRepository.deleteById(flag.flagId!!)
        entityManager.flush()

        // then
        val deletedFlag = flagRepository.findById(flag.flagId!!)
        assertThat(deletedFlag).isEmpty()
    }

    @Test
    fun `Flag Entity 조회 테스트`() {
        // given
        val flag = Flag(
            title = "test",
            description = "test test",
            maintainer = member!!,
            type = FlagType.BOOLEAN,
            tags = mutableListOf(),
            keywords = mutableListOf(),
        )
        entityManager.persist(flag)
        entityManager.flush()

        // when
        val savedFlag = flagRepository.findById(flag.flagId!!).get()

        // then
        assertThat(savedFlag.flagId!! > 0)
        assertThat(savedFlag.title).isEqualTo(flag.title)
    }
}