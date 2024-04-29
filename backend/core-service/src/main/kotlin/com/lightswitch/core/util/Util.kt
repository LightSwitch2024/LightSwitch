package com.lightswitch.core.util

import io.swagger.v3.core.util.Json

fun toJson(obj: Any): String {
    return Json.mapper().writeValueAsString(obj)
}