package com.lightswitch.core.domain.flag.common.enum

enum class HistoryType {
    // flag
    CREATE,
    UPDATE_TITLE,
    UPDATE_TYPE,
    SWITCH,
    DELETE,

    // variation
    UPDATE_VALUE,
    UPDATE_PORTION,
    DELETE_VALUE,

    // keyword
    UPDATE_KEYWORD,
    DELETE_KEYWORD,
    CREATE_KEYWORD,

    // property
    UPDATE_DATA,
    DELETE_DATA,
    CREATE_DATA,
    UPDATE_PROPERTY,
    DELETE_PROPERTY,
    CREATE_PROPERTY,
}