package kr.lightswitch.model.response

import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(
    val memberId: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val telNumber: String,
    val orgName: String
)