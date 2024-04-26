package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.LogInReqDto
import com.lightswitch.core.domain.member.dto.req.MemberUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.PasswordUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.service.MemberService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "Member", description = "회원 관련 API")
@RestController
@RequestMapping("v1/user")
class MemberController(
    private val memberService: MemberService,
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
        return ResponseEntity.ok(memberService.signUp(signupReqDto))
    }


    @PostMapping("/login")
    fun logIn(
        @RequestBody logInReqDto: LogInReqDto
    ): ResponseEntity<MemberResDto> {
        return ResponseEntity.ok(memberService.logIn(logInReqDto))
    }

    // 이름, 전화번호 수정
    @PutMapping("/modifyUser")
    fun modifyUserdata(
        @RequestBody newUserData: MemberUpdateReqDto
    ): ResponseEntity<MemberResDto> {
        return ResponseEntity.ok(memberService.modifyUserdata(newUserData))
    }

    // 비밀번호 수정
    @PutMapping("/modifyPassword")
    fun modifyPassword(
        @RequestBody pwUpdateData: PasswordUpdateReqDto
    ): ResponseEntity<MemberResDto> {
        return ResponseEntity.ok(memberService.modifyPassword(pwUpdateData))
    }
}