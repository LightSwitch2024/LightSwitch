package com.lightswitch.logservice.domain.log.service

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
internal class LogServiceTest (
    @Autowired private val logService: LogService
) {
    private val userKey1 = "userKey1"
    private val userKey2 = "userKey2"

    private val json1 = "{" +
            "\"name\": \"name1\"," +
            "\"age\": 1" +
            "}"
    private val json2 = "{" +
            "\"name\": \"name2\"," +
            "\"age\": 2," +
            "\"location\": \"seoul\"" +
            "}"

    @BeforeEach
    fun setUp() {
        logService.deleteAllLogs()
    }

    @Test
    @DisplayName("add 테스트")
    fun `should add a log`() {
        assertThat(logService.findByJsonName("name1")).isEmpty()
        logService.addLog(userKey1, json1)
        logService.addLog(userKey2, json2)

        val logs = logService.findByJsonLocation("seoul")
        for(log in logs) {
            println(log.json["name"].toString() + " " + (log.json["age"] as Double).toInt())
        }
        assertThat(logService.findByJsonName("name1")).hasSize(1)
    }
}
