package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.service.MemberService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class MemberController (
    private val memberService: MemberService
) {

    @PostMapping
    fun signUp(@RequestBody signupReqDto: SignupReqDto): ResponseEntity<Member> {
        return ResponseEntity.ok(memberService.signUp(signupReqDto.email, signupReqDto.password, signupReqDto.authCode))
    }
}