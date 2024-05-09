package kr.lightswitch.model.response

import kotlinx.serialization.Serializable

@Serializable
data class Tag(
    val colorHex: String,
    val content: String
)