package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.LogInReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.service.MemberService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "Member", description = "회원 관련 API")
@RestController
@RequestMapping("api/v1/user")
class MemberController(
    private val memberService: MemberService,
    private val memberRepository: MemberRepository
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
    ): ResponseEntity<Boolean> {
        return ResponseEntity.ok(memberService.logIn(logInReqDto.email, logInReqDto.password))
    }

    // 이름, 전화번호 수정
    @PostMapping("/modifyUser")
    fun modifyUserdata(
        @RequestParam(value = "email") email: String,
        @RequestBody newUserData: MemberResDto
    ): ResponseEntity<Member> {
        return ResponseEntity.ok(memberService.modifyUserdata(email, newUserData))
    }

    // 비밀번호 수정
    @PostMapping("/modifyPassword")
    fun modifyPassword(
        @RequestParam(value = "email") email: String,
        @RequestParam(value = "oldPassword") oldPassword: String,
        @RequestParam(value = "newPassword") newPassword: String
    ): ResponseEntity<Member> {
        val savedMember: Member? = memberRepository.findByEmail(email)
        if (savedMember?.password != oldPassword) {
            throw MemberException("입력해주신 기존 비밀번호가 옳지 않습니다")
        } else {
            return ResponseEntity.ok(memberService.modifyPassword(email, newPassword))
        }
    }
}