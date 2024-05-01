package com.lightswitch.core.domain.member.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.ResponseCode
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.common.exception.BaseException
import com.lightswitch.core.domain.member.dto.req.SdkKeyReqDto
import com.lightswitch.core.domain.member.dto.req.MemberUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.LogInReqDto
import com.lightswitch.core.domain.member.dto.req.PasswordUpdateReqDto
import com.lightswitch.core.domain.member.dto.req.SignupReqDto
import com.lightswitch.core.domain.member.dto.res.MemberResDto
import com.lightswitch.core.domain.member.dto.res.MemberResponseDto
import com.lightswitch.core.domain.member.dto.res.SdkKeyResDto
import com.lightswitch.core.domain.member.entity.Member
import com.lightswitch.core.domain.member.service.MemberService
import io.swagger.v3.oas.annotations.tags.Tag
import com.lightswitch.core.domain.member.service.SdkKeyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "Member", description = "회원 관련 API")
@RestController
@RequestMapping("/v1/member")
class MemberController(
    private val memberService: MemberService,
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
    fun signUp(@RequestBody signupReqDto: SignupReqDto): BaseResponse<MemberResponseDto> {
        return success(memberService.signUp(signupReqDto))
    }


    @PostMapping("/login")
    fun logIn(
        @RequestBody logInReqDto: LogInReqDto
    ): BaseResponse<MemberResDto> {
        return success(memberService.logIn(logInReqDto))
    }

    // 유저 정보 불러오기
    @GetMapping("/{email}")
    fun getUser(
        @PathVariable email: String
    ): BaseResponse<MemberResDto> {
        return success(memberService.getUser(email))
    }

    // 유저 이름,전화번호 수정
    @PutMapping("/{email}")
    fun updateUser(
        @PathVariable email: String,
        @RequestBody newUserData: MemberUpdateReqDto
    ): BaseResponse<MemberResDto?> {
        return success(memberService.updateUser(email, newUserData))
    }

    // 비밀번호 수정
    @PutMapping("/{email}/password")
    fun updatePassword(
        @PathVariable email: String,
        @RequestBody pwUpdateData: PasswordUpdateReqDto
    ): BaseResponse<MemberResDto?> {
        return success(memberService.updatePassword(email, pwUpdateData))
    }

    // 유저 삭제
//    @DeleteMapping("/{email}")
//    fun deleteUser(
//        @RequestBody newUserData: MemberUpdateRequestDto
//    ): ResponseEntity<MemberResponseDto> {
//        return ResponseEntity.ok(memberService.deleteUser(newUserData))
//    }


    @PostMapping("/sdkKey")
    fun createSdkKey(@RequestBody sdkKeyReqDto: SdkKeyReqDto): BaseResponse<SdkKeyResDto> {
        return success(sdkKeyService.createSdkKey(sdkKeyReqDto))
    }

}