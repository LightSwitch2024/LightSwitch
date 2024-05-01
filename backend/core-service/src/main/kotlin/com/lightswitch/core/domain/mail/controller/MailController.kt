package com.lightswitch.core.domain.mail.controller

import com.lightswitch.core.common.dto.BaseResponse
import com.lightswitch.core.common.dto.success
import com.lightswitch.core.domain.mail.dto.req.MailCheckReqDto
import com.lightswitch.core.domain.mail.dto.req.MailReqDto
import com.lightswitch.core.domain.mail.service.MailService
import lombok.extern.slf4j.Slf4j
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/mail")
@Slf4j
class MailController(
    private val mailService: MailService
) {

    @PostMapping("/send")
    fun send(@RequestBody mailReqDto: MailReqDto): BaseResponse<String> {
        println("mailReqDto: ${mailReqDto.email}")
        mailService.sendMail(mailReqDto.email)
        return success("문자 메일이 성공적으로 발송 되었습니다.")
    }

    @PostMapping("/confirm")
    fun check(@RequestBody mailCheckReqDto: MailCheckReqDto): BaseResponse<Boolean> {

        return success(mailService.checkMail(mailCheckReqDto.email, mailCheckReqDto.authCode))
    }
}