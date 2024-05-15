package com.lightswitch.core.domain.flag.dto.res

import com.lightswitch.core.domain.flag.common.enum.FlagType
import com.lightswitch.core.domain.flag.dto.KeywordDto
import com.lightswitch.core.domain.flag.dto.PropertyDto
import com.lightswitch.core.domain.flag.dto.VariationDto
import com.lightswitch.core.domain.flag.repository.entity.Flag
import com.lightswitch.core.domain.history.dto.HistoryResponse
import com.lightswitch.core.domain.history.repository.entity.History

data class FlagResponseDto(
    val flagId: Long?,
    val title: String,
    val tags: List<TagResponseDto>,
    val description: String,
    val type: FlagType,
    val keywords: List<KeywordDto>,
    var defaultValue: String? = null,
    var defaultPortion: Int? = null,
    var defaultDescription: String? = null,
    val variations: List<VariationDto>? = mutableListOf(),
    val memberId: Long?,
    val createdAt: String,
    val updatedAt: String,
    val active: Boolean,
    val histories: List<HistoryResponse>? = mutableListOf()
) {
    constructor(flag: Flag) : this(
        flagId = flag.flagId,
        title = flag.title,
        tags = flag.tags.map { TagResponseDto(it.colorHex, it.content) },
        description = flag.description,
        type = flag.type,
        keywords = flag.keywords.map { k ->
            KeywordDto(
                keywordId = k.keywordId,
                properties = k.properties.map { p ->
                    PropertyDto(
                        propertyId = p.propertyId,
                        property = p.property,
                        data = p.data,
                    )
                },
                description = k.description,
                value = k.value,
            )
        },
        memberId = flag.maintainer.memberId,
        createdAt = flag.createdAt.toString(),
        updatedAt = flag.updatedAt.toString(),
        active = flag.active
    )

    fun toSseInitDto(): FlagInitResponseDto {
        return FlagInitResponseDto(
            flagId = flagId,
            title = title,
            description = description,
            type = type,
            defaultValue = defaultValue,
            defaultPortion = defaultPortion,
            defaultDescription = defaultDescription,
            variations = variations,
            keywords = keywords.map { k ->
                KeywordDto(
                    keywordId = k.keywordId,
                    properties = k.properties.map { p ->
                        PropertyDto(
                            propertyId = p.propertyId,
                            property = p.property,
                            data = p.data,
                        )
                    },
                    description = k.description,
                    value = k.value,
                )
            },
            maintainerId = memberId,
            createdAt = createdAt.toString(),
            updatedAt = updatedAt.toString(),
            deleteAt = "",
            active = active
        )
    }
}