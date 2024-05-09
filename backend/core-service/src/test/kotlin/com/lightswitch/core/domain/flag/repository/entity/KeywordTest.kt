package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.KeywordRepository
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.service.MemberService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class KeywordTest {

    @Autowired
    private lateinit var keywordRepository: KeywordRepository

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var memberRepository: MemberRepository

    @Autowired
    private lateinit var memberService: MemberService

    var flag: Flag? = null

    @BeforeEach
    fun setUp() {
        memberRepository.findAllAByDeletedAtIsNull().map {
            memberService.deleteUser(it.memberId!!)
        }

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
    fun `keyword 저장 테스트`() {
        // given
        val keyword1 = Keyword(
            flag = flag!!, description = "test", value = "test"
        )

        val keyword2 = Keyword(
            flag = flag!!, description = "test2", value = "test2"
        )

        // when
        val keywordList = keywordRepository.saveAll(listOf(keyword1, keyword2))

        // then
        assertThat(keywordList).hasSize(2)
        assertThat(keywordList.first().description).isEqualTo("test")
        assertThat(keywordList.first().value).isEqualTo("test")
        assertThat(keywordList.last().description).isEqualTo("test2")
        assertThat(keywordList.last().value).isEqualTo("test2")
    }

}