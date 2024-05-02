package com.lightswitch.core.domain.flag.repository.entity

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.repository.FlagRepository
import com.lightswitch.core.domain.flag.repository.TagRepository
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class FlagTest {

    @Autowired
    private lateinit var flagRepository: FlagRepository

    @Autowired
    private lateinit var tagRepository: TagRepository

    @Autowired
    private lateinit var memberRepository: MemberRepository

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
        )
        val savedFlag = flagRepository.save(flag)

        // then
        assertNotNull(savedFlag.flagId)
        assertThat(savedFlag.active).isFalse()
    }
}