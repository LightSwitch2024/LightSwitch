package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.service.MemberService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class MemberController(
    private val memberService: MemberService
) {

    @GetMapping("/hello")
    fun hello(): BaseResponse<String> {
        return success("hello")
    }

    @GetMapping("/exception")
    fun exception(): BaseResponse<Any> {
        throw BaseException(ResponseCode.SAMPLE_EXCEPTION)
    }

    @PostMapping
    fun signUp(@RequestBody signupReqDto: SignupReqDto): ResponseEntity<Member> {
        return ResponseEntity.ok(memberService.signUp(signupReqDto.email, signupReqDto.password, signupReqDto.authCode))
    }
}