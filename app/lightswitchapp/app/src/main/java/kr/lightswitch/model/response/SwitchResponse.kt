package kr.lightswitch.model.response

import kotlinx.serialization.Serializable

@Serializable
data class SwitchResponse(
    var active: Boolean
)