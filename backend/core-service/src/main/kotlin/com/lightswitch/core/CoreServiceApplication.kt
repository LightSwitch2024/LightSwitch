package com.lightswitch.core

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CoreServiceApplication

fun main(vararg args: String) {
    runApplication<CoreServiceApplication>(*args)
}
