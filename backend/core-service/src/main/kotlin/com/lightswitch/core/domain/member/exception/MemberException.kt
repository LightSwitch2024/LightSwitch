package com.lightswitch.core.domain.member.exception

class MemberException : RuntimeException {
    constructor(message: String) : super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
}