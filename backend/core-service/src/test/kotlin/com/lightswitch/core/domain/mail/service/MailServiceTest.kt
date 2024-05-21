package com.lightswitch.core.domain.mail.service

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class MailServiceTest(
    @Autowired
    private val mailService: MailService
) {

    @Test
    fun sendMail() {
        assertThat(mailService.createNumber()).isNotNull()
//        mailService.sendMail("huni19541@gmail.com")
    }
}