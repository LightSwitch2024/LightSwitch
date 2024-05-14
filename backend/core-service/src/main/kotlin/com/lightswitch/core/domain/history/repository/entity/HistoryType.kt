package com.lightswitch.core.domain.history.repository.entity

enum class HistoryType {
    // flag
    CREATE_FLAG,
    UPDATE_FLAG_TITLE,
    UPDATE_FLAG_TYPE,
    SWITCH_FLAG,
    DELETE_FLAG,


    // variation
    CREATE_VARIATION,
    UPDATE_VARIATION_VALUE,
    UPDATE_VARIATION_PORTION,
    DELETE_VARIATION,

    // keyword
    CREATE_KEYWORD,
    UPDATE_KEYWORD,

    //    UPDATE_KEYWORD_PROPERTY,
    DELETE_KEYWORD,

    // property
    CREATE_PROPERTY,
    UPDATE_PROPERTY_KEY,
    UPDATE_PROPERTY_VALUE,
    DELETE_PROPERTY,
}