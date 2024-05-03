package kr.lightswitch.model.response

import kotlinx.serialization.Serializable

@Serializable
data class Flag(
    val active: Boolean,
    val description: String,
    val flagId: Int,
    val maintainerName: String,
    val tags: List<Tag>,
    val title: String
)