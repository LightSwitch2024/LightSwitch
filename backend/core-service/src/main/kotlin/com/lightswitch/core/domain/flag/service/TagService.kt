package com.lightswitch.core.domain.flag.service

import com.lightswitch.core.domain.flag.dto.res.TagResponseDto
import com.lightswitch.core.domain.flag.repository.TagRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class TagService(
    private val tagRepository: TagRepository
) {

    fun getAllTags(): List<TagResponseDto> {
        val tagList = tagRepository.findAll()
        return tagList.map {
            TagResponseDto(
                colorHex = it.colorHex,
                content = it.content
            )
        }
    }

    fun getTagByContent(content: String): List<TagResponseDto> {
        val tagList = tagRepository.findByContentContaining(content)
        return tagList.map {
            TagResponseDto(
                colorHex = it.colorHex,
                content = it.content
            )
        }
    }
}