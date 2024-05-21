package com.lightswitch.core.domain.test.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class TestControllerTests(
    @Autowired
    private val mockMvc: MockMvc
) {

    @Test
    fun testReturnStrEndpoint() {
        val testString = "test"
        mockMvc.perform(
            get("/returnStr")
                .param("str", testString)
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().string("$testString\n$testString"))
    }

    @Test
    fun testExampleEndpoint() {
        mockMvc.perform(
            get("/example")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8)
        )
            .andExpect(status().isOk)
            .andExpect(content().string("예시 API"))
    }

    // "/ignore" 엔드포인트는 @Hidden 어노테이션에 의해 무시되므로 테스트 코드 작성하지 않음
}