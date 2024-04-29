package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.SdkKeyReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.dto.res.SdkKeyResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.exception.MemberException
import com.lightswitch.core.domain.member.repository.MemberRepository
import com.lightswitch.core.domain.member.service.MemberService
import com.lightswitch.core.domain.member.service.SdkKeyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/member")
class MemberController(
    private val memberService: MemberService,
    private val memberRepository: MemberRepository,
    private val sdkKeyService: SdkKeyService
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
    fun logIn(@RequestBody signupReqDto: SignupReqDto): ResponseEntity<Boolean> {
        return ResponseEntity.ok(memberService.logIn(signupReqDto.email, signupReqDto.password))
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

    @PostMapping("/sdkKey")
    fun createSdkKey(@RequestBody sdkKeyReqDto: SdkKeyReqDto): BaseResponse<SdkKeyResDto> {
        return success(sdkKeyService.createSdkKey(sdkKeyReqDto))
    }
}