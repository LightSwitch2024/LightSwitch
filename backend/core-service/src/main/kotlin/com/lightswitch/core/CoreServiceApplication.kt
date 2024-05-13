package com.lightswitch.core

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.EnableAspectJAutoProxy

@SpringBootApplication
@EnableAspectJAutoProxy
class CoreServiceApplication

fun main(vararg args: String) {
    runApplication<CoreServiceApplication>(*args)
}
