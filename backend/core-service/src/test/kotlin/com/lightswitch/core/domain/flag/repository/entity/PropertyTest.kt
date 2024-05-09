package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.KeywordRepository
import com.lightswitch.core.domain.flag.repository.PropertyRepository
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
class PropertyTest {

    @Autowired
    private lateinit var memberRepository: MemberRepository

    @Autowired
    private lateinit var memberService: MemberService

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var keywordRepository: KeywordRepository

    @Autowired
    private lateinit var propertyRepository: PropertyRepository

    var keyword: Keyword? = null

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
                title = "test", description = "test", type = FlagType.BOOLEAN, maintainer = savedMember
            )
        )

        val savedKeyword = keywordRepository.save(
            Keyword(
                flag = savedFlag,
                description = "test",
                value = "test"
            )
        )
        keyword = savedKeyword
    }

    @Test
    fun `property 저장 테스트`() {
        // given
        val property1 = Property(
            keyword = keyword!!, property = "test", data = "test"
        )

        val property2 = Property(
            keyword = keyword!!, property = "test2", data = "test2"
        )

        // when
        val propertyList = propertyRepository.saveAll(listOf(property1, property2))

        // then
        assertThat(propertyList).hasSize(2)
        assertThat(propertyList.first().property).isEqualTo("test")
        assertThat(propertyList.first().data).isEqualTo("test")
        assertThat(propertyList.last().property).isEqualTo("test2")
        assertThat(propertyList.last().data).isEqualTo("test2")
    }
}