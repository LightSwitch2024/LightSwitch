package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.*
import com.lightswitch.core.domain.member.dto.res.MemberResponseDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.service.MemberService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "Member", description = "회원 관련 API")
@RestController
@RequestMapping("api/v1/user")
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
        @RequestBody logInReqDto: LogInRequestDto
    ): ResponseEntity<MemberResponseDto> {
        return ResponseEntity.ok(memberService.logIn(logInReqDto))
    }

    // 유저 정보 불러오기
    @GetMapping("/{email}")
    fun getUser(
        @PathVariable email: String
    ): ResponseEntity<MemberResponseDto> {
        println("요청 진행 됨")
        return ResponseEntity.ok(memberService.getUser(email))
    }

    // 유저 이름,전화번호 수정
    @PutMapping("/{email}")
    fun updateUser(@PathVariable email: String,
        @RequestBody newUserData: MemberUpdateRequestDto
    ): ResponseEntity<MemberResponseDto> {
        return ResponseEntity.ok(memberService.updateUser(newUserData))
    }

    // 비밀번호 수정
    @PutMapping("/{email}/password")
    fun updatePassword(@PathVariable email: String,
        @RequestBody pwUpdateData: PasswordUpdateRequestDto
    ): ResponseEntity<MemberResponseDto> {
        return ResponseEntity.ok(memberService.updatePassword(pwUpdateData))
    }

    // 유저 삭제
//    @DeleteMapping("/{email}")
//    fun deleteUser(
//        @RequestBody newUserData: MemberUpdateRequestDto
//    ): ResponseEntity<MemberResponseDto> {
//        return ResponseEntity.ok(memberService.deleteUser(newUserData))
//    }
}