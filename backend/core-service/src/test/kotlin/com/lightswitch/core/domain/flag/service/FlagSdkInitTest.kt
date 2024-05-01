package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.dto.req.FlagInitRequestDto
import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
import com.lightswitch.core.domain.flag.dto.req.TagRequestDto
import com.lightswitch.core.domain.member.dto.req.SdkKeyReqDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.repository.SdkKeyRepository
import com.lightswitch.core.domain.member.service.SdkKeyService
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@Transactional
@SpringBootTest
class FlagSdkInitTest(
    @Autowired
    private val flagService: FlagService,

    @Autowired
    private val memberRepository: MemberRepository,

    @Autowired
    private val sdkKeyService: SdkKeyService,

    @Autowired
    private val sdkKeyRepository: SdkKeyRepository,
) {

    fun signUpAndSdkKeyForTest(): String {

        memberRepository.findByEmail("test@gmail.com")?.let {
            memberRepository.delete(it)
        }
        val member = memberRepository.save(
            Member(
                lastName = "test",
                firstName = "test",
                telNumber = "01012345678",
                email = "test@gmail.com",
                password = "test",
            )
        )


        val sdkKeyReqDto = SdkKeyReqDto(
            email = member.email
        )

        return sdkKeyService.createSdkKey(sdkKeyReqDto).key
    }

    @Test
    fun `SDK init()시 SDK_KEY에 해당하는 유저의 모든 Flag 정보 조회`() {
        // given
        val sdkKey = signUpAndSdkKeyForTest()
        val memberId = sdkKeyRepository.findByKey(sdkKey)!!.member.memberId

        val tag1 = TagRequestDto(
            colorHex = "#FFFFFF",
            content = "test"
        )

        val tag2 = TagRequestDto(
            colorHex = "#000000",
            content = "test2"
        )

        val flagRequestDto = FlagRequestDto(
            title = "test",
            tags = listOf(tag1, tag2),
            description = "test",
            type = FlagType.BOOLEAN,
            defaultValue = "TRUE",
            defaultValuePortion = 100,
            defaultValueDescription = "test",
            variations = listOf(
                VariationDto(
                    value = "FALSE",
                    portion = 0,
                    description = "test"

                )
            ),
            userId = memberId!!,

            keywords = listOf(),
            defaultValueForKeyword = "",
            defaultValuePortionForKeyword = 0,
            defaultValueDescriptionForKeyword = "",
            variationsForKeyword = listOf()
        )
        flagService.createFlag(flagRequestDto)

        val flagRequestDto2 = FlagRequestDto(
            title = "test2",
            tags = listOf(tag2),
            description = "test2",
            type = FlagType.INTEGER,
            defaultValue = "1",
            defaultValuePortion = 80,
            defaultValueDescription = "1 test",
            variations = listOf(
                VariationDto(
                    value = "2",
                    portion = 10,
                    description = "2 test"
                ),
                VariationDto(
                    value = "3",
                    portion = 10,
                    description = "3 test"
                )
            ),
            userId = memberId,

            keywords = listOf(
                KeywordDto(
                    keyword = "test",
                    description = "test",
                )
            ),
            defaultValueForKeyword = "1",
            defaultValuePortionForKeyword = 100,
            defaultValueDescriptionForKeyword = "test",
            variationsForKeyword = listOf(
                VariationDto(
                    value = "2",
                    portion = 0,
                    description = "test",
                )
            )
        )
        flagService.createFlag(flagRequestDto2)

        val flagRequestDto3 = FlagRequestDto(
            title = "test3",
            tags = listOf(tag1),
            description = "test3",
            type = FlagType.STRING,
            defaultValue = "A",
            defaultValuePortion = 10,
            defaultValueDescription = "A test",
            variations = listOf(
                VariationDto(
                    value = "B",
                    portion = 40,
                    description = "B test"
                ),
                VariationDto(
                    value = "C",
                    portion = 40,
                    description = "C test"
                ),
                VariationDto(
                    value = "D",
                    portion = 10,
                    description = "D test"
                )
            ),
            userId = memberId,

            keywords = listOf(
                KeywordDto(
                    keyword = "test",
                    description = "test",
                )
            ),
            defaultValueForKeyword = "A",
            defaultValuePortionForKeyword = 100,
            defaultValueDescriptionForKeyword = "test",
            variationsForKeyword = listOf(
                VariationDto(
                    value = "B",
                    portion = 0,
                    description = "test",
                )
            )
        )
        flagService.createFlag(flagRequestDto3)

        // when
        val flagInitRequestDto = FlagInitRequestDto(
            sdkKey = sdkKey
        )
        val flagList = flagService.getAllFlagForInit(flagInitRequestDto)

        // then
        Assertions.assertThat(flagList).hasSize(3)
    }
}