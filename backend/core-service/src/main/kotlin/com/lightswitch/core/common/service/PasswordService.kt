package com.lightswitch.core.common.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class PasswordService(
    private val passwordEncoder: PasswordEncoder
) {
    fun encode(password: String): String {
        return passwordEncoder.encode(password)
    }

    fun matches(rawPassword: String, encodedPassword: String): Boolean {
        return passwordEncoder.matches(rawPassword, encodedPassword)
    }

}