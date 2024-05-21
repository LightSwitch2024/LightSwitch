//package com.lightswitch.core.domain.flag.service
//
//import com.lightswitch.core.domain.flag.common.enum.FlagType
//import com.lightswitch.core.domain.flag.dto.KeywordDto
//import com.lightswitch.core.domain.flag.dto.PropertyDto
//import com.lightswitch.core.domain.flag.dto.VariationDto
//import com.lightswitch.core.domain.flag.dto.req.FlagRequestDto
//import com.lightswitch.core.domain.flag.dto.req.TagRequestDto
//import com.lightswitch.core.domain.flag.repository.*
//import com.lightswitch.core.domain.member.dto.req.SdkKeyReqDto
//import com.lightswitch.core.domain.member.entity.Member
//import com.lightswitch.core.domain.member.repository.MemberRepository
//import com.lightswitch.core.domain.member.service.MemberService
//import com.lightswitch.core.domain.member.service.SdkKeyService
//import org.assertj.core.api.Assertions.assertThat
//import org.junit.jupiter.api.Assertions.assertEquals
//import org.junit.jupiter.api.Assertions.assertNotNull
//import org.junit.jupiter.api.BeforeEach
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.transaction.annotation.Transactional
//
//@Transactional
//@SpringBootTest
//class FlagServiceTest(
//    @Autowired
//    private val flagRepository: FlagRepository,
//
//    @Autowired
//    private val flagService: FlagService,
//
//    @Autowired
//    private val tagRepository: TagRepository,
//
//    @Autowired
//    private val variationRepository: VariationRepository,
//
//    @Autowired
//    private val memberRepository: MemberRepository,
//
//    @Autowired
//    private val memberService: MemberService,
//
//    @Autowired
//    private val sdkKeyService: SdkKeyService,
//
//    @Autowired
//    private val keywordRepository: KeywordRepository,
//
//    @Autowired
//    private val propertyRepository: PropertyRepository
//) {
//
//    var memberId: Long = 0L
//
//    @BeforeEach
//    fun setUp() {
//
//        memberRepository.findAllAByDeletedAtIsNull().map {
//            memberService.deleteUser(it.memberId!!)
//        }
//
//        val savedMember = memberRepository.findByEmailAndDeletedAtIsNull("test@gmail.com") ?: let {
//            memberRepository.save(
//                Member(
//                    lastName = "test",
//                    firstName = "test",
//                    telNumber = "01012345678",
//                    email = "test@gmail.com",
//                    password = "test",
//                )
//            )
//        }
//
//        memberId = savedMember.memberId!!
//
//        val sdkKeyReqDto = SdkKeyReqDto(
//            email = savedMember.email
//        )
//
//        sdkKeyService.createSdkKey(sdkKeyReqDto).key
//    }
//
//    @Test
//    fun `flag 생성 test 1 _ 일반값 Boolean`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//            keywords = listOf(
//            ),
//        )
//
//        // when
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // then
//        assertNotNull(flagResponseDto.flagId)
//        assertEquals(flagRequestDto.title, flagResponseDto.title)
//        assertEquals(flagRequestDto.description, flagResponseDto.description)
//        for (tag in flagResponseDto.tags) {
//            val tagFoundByContent = tagRepository.findByContent(tag.content)
//            if (tagFoundByContent != null) {
//                assertEquals(tagFoundByContent.colorHex, tag.colorHex)
//            }
//        }
//    }
//
//    @Test
//    fun `flag 생성 test 1 _ 일반값 String`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.STRING,
//            defaultValue = "A",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "B",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//
//        // when
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // then
//        assertNotNull(flagResponseDto.flagId)
//        assertEquals(flagRequestDto.title, flagResponseDto.title)
//        assertEquals(flagRequestDto.description, flagResponseDto.description)
//        for (tag in flagResponseDto.tags) {
//            val tagFoundByContent = tagRepository.findByContent(tag.content)
//            if (tagFoundByContent != null) {
//                assertEquals(tagFoundByContent.colorHex, tag.colorHex)
//            }
//        }
//    }
//
//    @Test
//    fun `flag 생성 test 1 _ 일반값 Integer`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.INTEGER,
//            defaultValue = "1",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "2",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//
//        // when
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // then
//        assertNotNull(flagResponseDto.flagId)
//        assertEquals(flagRequestDto.title, flagResponseDto.title)
//        assertEquals(flagRequestDto.description, flagResponseDto.description)
//        for (tag in flagResponseDto.tags) {
//            val tagFoundByContent = tagRepository.findByContent(tag.content)
//            if (tagFoundByContent != null) {
//                assertEquals(tagFoundByContent.colorHex, tag.colorHex)
//            }
//        }
//    }
//
//    @Test
//    fun `Flag 단건 조회 by flag_id`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.INTEGER,
//            defaultValue = "1",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "2",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        val flagId = flagResponseDto.flagId
//
//        // when
//        val testFlagResponseDto = flagService.getFlag(flagId)
//
//        // then
//        assertThat(testFlagResponseDto).isNotNull
//        assertThat(testFlagResponseDto.flagId).isEqualTo(flagResponseDto.flagId)
//        assertThat(testFlagResponseDto.defaultValue).isNotNull
//        assertThat(testFlagResponseDto.variations).isNotEmpty
//        assertThat(testFlagResponseDto.tags.size).isEqualTo(2)
//    }
//
//    @Test
//    fun `Flag 전체 조회`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        flagService.createFlag(flagRequestDto)
//
//        // when
//        val flagList = flagService.getAllFlag()
//
//        // then
//        assertThat(flagList).isNotEmpty()
//    }
//
//    @Test
//    fun `플래그 다중 필터링 서비스 로직 테스트`() {
//
//        val tag = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "v1.0"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "v2.0"
//        )
//
//        val tag3 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "UI"
//        )
//
//        val tag4 = TagRequestDto(
//            colorHex = "#000000",
//            content = "UX"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag, tag2, tag3, tag4),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 50,
//            defaultDescription = "true test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 50,
//                    description = "false test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        flagService.createFlag(flagRequestDto)
//
//        val flagRequestDto2 = FlagRequestDto(
//            title = "test2",
//            tags = listOf(tag2, tag3),
//            description = "test2",
//            type = FlagType.INTEGER,
//            defaultValue = "1",
//            defaultPortion = 80,
//            defaultDescription = "1 test",
//            variations = listOf(
//                VariationDto(
//                    value = "2",
//                    portion = 10,
//                    description = "2 test",
//                ),
//                VariationDto(
//                    value = "3",
//                    portion = 10,
//                    description = "3 test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        flagService.createFlag(flagRequestDto2)
//
//        val flagRequestDto3 = FlagRequestDto(
//            title = "test3",
//            tags = listOf(tag3, tag4),
//            description = "test3",
//            type = FlagType.INTEGER,
//            defaultValue = "1",
//            defaultPortion = 10,
//            defaultDescription = "A test",
//            variations = listOf(
//                VariationDto(
//                    value = "10",
//                    portion = 40,
//                    description = "B test",
//                ),
//                VariationDto(
//                    value = "100",
//                    portion = 50,
//                    description = "C test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        flagService.createFlag(flagRequestDto3)
//
//
//        val result = flagService.filteredFlags(listOf(tag4.content))
//        assertThat(result).hasSize(2)
//
//        val result2 = flagService.filteredFlags(listOf(tag.content))
//        assertThat(result2).hasSize(1)
//
//        val result3 = flagService.filteredFlags(
//            listOf(
//                tag.content,
//                tag2.content
//            )
//        )
//        assertThat(result3).hasSize(1)
//
//        val result4 = flagService.filteredFlags(
//            listOf(
//                tag2.content,
//                tag3.content
//            )
//        )
//        assertThat(result4).hasSize(2)
//
//        val result5 = flagService.filteredFlags(
//            listOf(
//                tag3.content,
//                tag4.content
//            )
//        )
//        assertThat(result5).hasSize(2)
//
//        val result6 = flagService.filteredFlags(listOf(tag3.content))
//        assertThat(result6).hasSize(3)
//    }
//
//    @Test
//    fun `Flag 삭제 테스트 _ soft delete`() {
//        //given
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(),
//            description = "test",
//            type = FlagType.INTEGER,
//            defaultValue = "1",
//            defaultPortion = 50,
//            defaultDescription = "true test",
//            variations = listOf(
//                VariationDto(
//                    value = "2",
//                    portion = 30,
//                    description = "false test",
//                ),
//                VariationDto(
//                    value = "3",
//                    portion = 10,
//                    description = "false test",
//                ),
//                VariationDto(
//                    value = "4",
//                    portion = 10,
//                    description = "false test",
//                ),
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        val createdFlag = flagService.createFlag(flagRequestDto)
//
//        //when
//        val deletedFlagId = flagService.deleteFlag(createdFlag.flagId)
//
//        //then
//        assertThat(deletedFlagId).isEqualTo(createdFlag.flagId)
//        assertThat(flagRepository.findById(deletedFlagId).get().deletedAt).isNotNull()
//        variationRepository.findByFlagFlagId(deletedFlagId).map {
//            assertThat(it.deletedAt).isNotNull()
//        }
//    }
//
//    @Test
//    fun `Flag 활성 & 비활성 간단 조작_ switchFlag`() {
//        //given
////        val flagRequestDto = FlagRequestDto(
////            title = "test",
////            tags = listOf(),
////            description = "test",
////            type = FlagType.BOOLEAN,
////            defaultValue = "TRUE",
////            defaultPortion = 50,
////            defaultDescription = "true test",
////            variations = listOf(
////                VariationDto(
////                    value = "FALSE",
////                    portion = 50,
////                    description = "false test",
////                )
////            ),
////            memberId = memberId,
////
////            keywords = listOf(
////            ),
////        )
////        val flagId = flagService.createFlag(flagRequestDto).flagId
////
////        //when
////        val flag = flagService.getFlag(flagId)
////        val switchFlag = flagService.switchFlag(flagId)
////        val switchedFlag = flagService.getFlag(switchFlag)
////
////        //then
////        assertThat(switchFlag).isEqualTo(flagId)
////        assertThat(flag.active).isNotEqualTo(switchedFlag.active)
//    }
//
//    @Test
//    fun `Flag 수정 테스트`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.INTEGER,
//            defaultValue = "1",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "2",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // when
//        val updatedFlagResponseDto = flagService.updateFlag(
//            flagResponseDto.flagId,
//            flagRequestDto.copy(
//                title = "updated",
//                description = "updated",
//                tags = listOf(
//                    tag1.copy(content = "updated"),
//                ),
//                type = FlagType.STRING,
//                defaultValue = "A",
//                defaultPortion = 80,
//                defaultDescription = "updatedA",
//                variations = listOf(
//                    VariationDto(
//                        value = "B",
//                        portion = 10,
//                        description = "updatedB",
//                    ),
//                    VariationDto(
//                        value = "C",
//                        portion = 10,
//                        description = "updatedC",
//                    )
//                ),
//                keywords = listOf(
//                ),
//            )
//        )
//
//        // then
//        assertThat(updatedFlagResponseDto.flagId).isEqualTo(flagResponseDto.flagId)
//        assertThat(updatedFlagResponseDto.title).isEqualTo("updated")
//        assertThat(updatedFlagResponseDto.description).isEqualTo("updated")
//        assertThat(updatedFlagResponseDto.tags.size).isEqualTo(1)
//        assertThat(updatedFlagResponseDto.tags[0].content).isEqualTo("updated")
//        assertThat(updatedFlagResponseDto.type).isEqualTo(FlagType.STRING)
//        assertThat(updatedFlagResponseDto.defaultValue).isEqualTo("A")
//        assertThat(updatedFlagResponseDto.defaultPortion).isEqualTo(80)
//        assertThat(updatedFlagResponseDto.defaultDescription).isEqualTo("updatedA")
//        assertThat(updatedFlagResponseDto.variations).hasSize(2)
//        assertThat(updatedFlagResponseDto.variations.first().value).isEqualTo("B")
//        assertThat(updatedFlagResponseDto.variations.first().portion).isEqualTo(10)
//        assertThat(updatedFlagResponseDto.variations.first().description).isEqualTo("updatedB")
//        assertThat(updatedFlagResponseDto.variations.last().value).isEqualTo("C")
//        assertThat(updatedFlagResponseDto.variations.last().portion).isEqualTo(10)
//        assertThat(updatedFlagResponseDto.variations.last().description).isEqualTo("updatedC")
//    }
//
//    @Test
//    fun `메인 페이지 overview 정보 _ total flag 갯수와 active flag 갯수`() {
//        // given
//        val totalFlagList = flagRepository.findByDeletedAtIsNull()
//        val activeFlagList = totalFlagList.filter { it.active }
//
//        val flagRequestDto1 = FlagRequestDto(
//            title = "test",
//            tags = listOf(),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 50,
//            defaultDescription = "true test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 50,
//                    description = "false test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        val flagId = flagService.createFlag(flagRequestDto1).flagId
////        flagService.switchFlag(flagId)
//
//        val flagRequestDto2 = FlagRequestDto(
//            title = "test2",
//            tags = listOf(),
//            description = "test2",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 50,
//            defaultDescription = "true test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 50,
//                    description = "false test",
//                )
//            ),
//            memberId = memberId,
//
//            keywords = listOf(
//            ),
//        )
//        flagService.createFlag(flagRequestDto2)
//
//        // when
//        val overview = flagService.getFlagCountForOverview()
//
//        // then
//        assertThat(overview["totalFlags"]).isEqualTo(totalFlagList.size + 2)
//        assertThat(overview["activeFlags"]).isEqualTo(activeFlagList.size + 1)
//    }
//
//    @Test
//    fun getFlagsSummaryByKeyword() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//            keywords = listOf(
//            ),
//        )
//        flagService.createFlag(flagRequestDto)
//
//        // when
//        val flagsSummaryByKeyword = flagService.getFlagsSummaryByKeyword("test")
//
//        // then
//        assertThat(flagsSummaryByKeyword).isNotEmpty
//    }
//
//    @Test
//    fun `Flag 생성 테스트 _ 키워드 프로퍼티 추가`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//            keywords = listOf(
//                KeywordDto(
//                    properties = listOf(
//                        PropertyDto(
//                            property = "test",
//                            data = "test"
//                        ),
//                        PropertyDto(
//                            property = "test2",
//                            data = "test2"
//                        )
//                    ),
//                    description = "test",
//                    value = "test"
//                ),
//                KeywordDto(
//                    properties = listOf(
//                        PropertyDto(
//                            property = "test3",
//                            data = "test3"
//                        ),
//                        PropertyDto(
//                            property = "test4",
//                            data = "test4"
//                        )
//                    ),
//                    description = "test2",
//                    value = "test2"
//                )
//            ),
//        )
//
//        // when
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // then
//        assertThat(flagResponseDto.keywords).isNotEmpty
//        assertThat(flagResponseDto.keywords.first().properties).hasSize(2)
//        assertThat(flagResponseDto.keywords.first().properties.first().property).isEqualTo("test")
//        assertThat(flagResponseDto.keywords.first().properties.first().data).isEqualTo("test")
//        assertThat(flagResponseDto.keywords.first().properties.last().property).isEqualTo("test2")
//        assertThat(flagResponseDto.keywords.first().properties.last().data).isEqualTo("test2")
//        assertThat(flagResponseDto.keywords.last().properties).hasSize(2)
//        assertThat(flagResponseDto.keywords.last().properties.first().property).isEqualTo("test3")
//        assertThat(flagResponseDto.keywords.last().properties.first().data).isEqualTo("test3")
//        assertThat(flagResponseDto.keywords.last().properties.last().property).isEqualTo("test4")
//        assertThat(flagResponseDto.keywords.last().properties.last().data).isEqualTo("test4")
//    }
//
//    @Test
//    fun `Flag 수정 테스트 _ 키워드 프로퍼티 추가`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//            keywords = listOf(
//                KeywordDto(
//                    properties = listOf(
//                        PropertyDto(
//                            property = "test",
//                            data = "test"
//                        ),
//                        PropertyDto(
//                            property = "test2",
//                            data = "test2"
//                        )
//                    ),
//                    description = "test",
//                    value = "test"
//                ),
//                KeywordDto(
//                    properties = listOf(
//                        PropertyDto(
//                            property = "test3",
//                            data = "test3"
//                        ),
//                        PropertyDto(
//                            property = "test4",
//                            data = "test4"
//                        )
//                    ),
//                    description = "test2",
//                    value = "test2"
//                )
//            ),
//        )
//
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // when
//        val updatedFlagResponseDto = flagService.updateFlag(
//            flagResponseDto.flagId, flagRequestDto.copy(
//                keywords = listOf(
//                    KeywordDto(
//                        properties = listOf(
//                            PropertyDto(
//                                property = "updated",
//                                data = "updated"
//                            ),
//                            PropertyDto(
//                                property = "updated2",
//                                data = "updated2"
//                            )
//                        ),
//                        description = "updated",
//                        value = "updated"
//                    ),
//                    KeywordDto(
//                        properties = listOf(
//                            PropertyDto(
//                                property = "updated3",
//                                data = "updated3"
//                            ),
//                            PropertyDto(
//                                property = "updated4",
//                                data = "updated4"
//                            )
//                        ),
//                        description = "updated2",
//                        value = "updated2"
//                    )
//                )
//            )
//        )
//
//        // then
//        assertThat(updatedFlagResponseDto.keywords).isNotEmpty
//        assertThat(updatedFlagResponseDto.keywords.first().properties).hasSize(2)
//        assertThat(updatedFlagResponseDto.keywords.first().properties.first().property).isEqualTo("updated")
//        assertThat(updatedFlagResponseDto.keywords.first().properties.first().data).isEqualTo("updated")
//        assertThat(updatedFlagResponseDto.keywords.first().properties.last().property).isEqualTo("updated2")
//        assertThat(updatedFlagResponseDto.keywords.first().properties.last().data).isEqualTo("updated2")
//        assertThat(updatedFlagResponseDto.keywords.last().properties).hasSize(2)
//        assertThat(updatedFlagResponseDto.keywords.last().properties.first().property).isEqualTo("updated3")
//        assertThat(updatedFlagResponseDto.keywords.last().properties.first().data).isEqualTo("updated3")
//        assertThat(updatedFlagResponseDto.keywords.last().properties.last().property).isEqualTo("updated4")
//        assertThat(updatedFlagResponseDto.keywords.last().properties.last().data).isEqualTo("updated4")
//    }
//
//    @Test
//    fun `Flag 삭제 테스트 _ 키워드 프로퍼티 추가`() {
//        // given
//        val tag1 = TagRequestDto(
//            colorHex = "#FFFFFF",
//            content = "test"
//        )
//
//        val tag2 = TagRequestDto(
//            colorHex = "#000000",
//            content = "test2"
//        )
//
//        val flagRequestDto = FlagRequestDto(
//            title = "test",
//            tags = listOf(tag1, tag2),
//            description = "test",
//            type = FlagType.BOOLEAN,
//            defaultValue = "TRUE",
//            defaultPortion = 100,
//            defaultDescription = "test",
//            variations = listOf(
//                VariationDto(
//                    value = "FALSE",
//                    portion = 0,
//                    description = "test",
//                )
//            ),
//            memberId = memberId,
//            keywords = listOf(
//                KeywordDto(
//                    properties = listOf(
//                        PropertyDto(
//                            property = "test",
//                            data = "test"
//                        ),
//                        PropertyDto(
//                            property = "test2",
//                            data = "test2"
//                        )
//                    ),
//                    description = "test",
//                    value = "test"
//                ),
//                KeywordDto(
//                    properties = listOf(
//                        PropertyDto(
//                            property = "test3",
//                            data = "test3"
//                        ),
//                        PropertyDto(
//                            property = "test4",
//                            data = "test4"
//                        )
//                    ),
//                    description = "test2",
//                    value = "test2"
//                )
//            ),
//        )
//
//        val flagResponseDto = flagService.createFlag(flagRequestDto)
//
//        // when
//        val deletedFlagId = flagService.deleteFlag(flagResponseDto.flagId)
//
//        // then
//        assertThat(deletedFlagId).isEqualTo(flagResponseDto.flagId)
//        assertThat(flagRepository.findById(deletedFlagId).get().deletedAt).isNotNull()
//        assertThat(flagRepository.findById(deletedFlagId).get().keywords).isEmpty()
//        keywordRepository.findByFlagFlagId(deletedFlagId).map {
//            assertThat(it.deletedAt).isNotNull()
//            assertThat(it.properties).isEmpty()
//            propertyRepository.findByKeywordKeywordId(it.keywordId!!).map {
//                assertThat(it.deletedAt).isNotNull()
//            }
//        }
//        variationRepository.findByFlagFlagId(deletedFlagId).map {
//            assertThat(it.deletedAt).isNotNull()
//        }
//    }
//
//}