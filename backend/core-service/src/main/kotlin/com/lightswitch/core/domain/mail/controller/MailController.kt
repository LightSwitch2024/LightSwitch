package com.lightswitch.core.domain.mail.controller

import com.lightswitch.core.domain.mail.dto.req.MailReqDto
import com.lightswitch.core.domain.mail.service.MailService
import lombok.extern.slf4j.Slf4j
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/mail")
@Slf4j
class MailController (
    private val mailService: MailService
) {

    @GetMapping("/send")
    fun send(@RequestBody mailReqDto: MailReqDto): ResponseEntity<String> {
        mailService.sendMail(mailReqDto.email)
        return ResponseEntity.ok().body("문자 메일이 성공적으로 발송 되었습니다.")
    }
}