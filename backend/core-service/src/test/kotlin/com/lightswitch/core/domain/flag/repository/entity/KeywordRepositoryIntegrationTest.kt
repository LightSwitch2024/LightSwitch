package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.KeywordRepository
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class KeywordRepositoryIntegrationTest(
    @Autowired
    val entityManager: TestEntityManager,

    @Autowired
    val keywordRepository: KeywordRepository,

    @Autowired
    val flagRepository: FlagRepository,

    @Autowired
    val memberRepository: MemberRepository,
) {

    var flag: Flag? = null

    @BeforeEach
    @Transactional
    fun setUp() {
        val savedMember = memberRepository.save(
            Member(
                lastName = "test",
                firstName = "test",
                telNumber = "01012345678",
                email = "test@gmail.com",
                password = "test",
            )
        )

        val savedFlag = flagRepository.save(
            Flag(
                title = "test",
                description = "test",
                type = FlagType.BOOLEAN,
                maintainer = savedMember
            )
        )
        flag = savedFlag
    }

    @Test
    fun `keyword 테스트`() {
        val findAll = keywordRepository.findAll()
        findAll.map {
            println(it.keywordId)
        }
    }

    @Test
    fun `keyword 저장 테스트`() {
        // given + when
        val keyword1 = Keyword(
            flag = flag!!, description = "test", value = "test"
        )

        val keyword2 = Keyword(
            flag = flag!!, description = "test2", value = "test2",
        )

        entityManager.persist(keyword1)
        entityManager.persist(keyword2)
        entityManager.flush()
        val keywordList = keywordRepository.findAll()

        // then
        assertThat(keywordList).hasSize(2)
        assertThat(keywordList.first().description).isEqualTo("test")
        assertThat(keywordList.first().value).isEqualTo("test")
        assertThat(keywordList.last().description).isEqualTo("test2")
        assertThat(keywordList.last().value).isEqualTo("test2")
    }

    @Test
    fun `keyword 삭제 테스트`() {
        // given
        val keyword = Keyword(
            flag = flag!!, description = "test", value = "test"
        )

        entityManager.persist(keyword)
        entityManager.flush()

        // when
        keywordRepository.deleteById(keyword.keywordId!!)
        entityManager.flush()

        // then
        assertThat(keywordRepository.findAll()).isEmpty()
    }
}