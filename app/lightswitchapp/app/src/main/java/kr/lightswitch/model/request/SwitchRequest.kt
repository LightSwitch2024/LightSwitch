package kr.lightswitch.model.request

import kotlinx.serialization.Serializable

@Serializable
data class SwitchRequest(
    var active: Boolean
)