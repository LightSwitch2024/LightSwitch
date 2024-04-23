package com.lightswitch.core.domain.flag.repository

import org.springframework.data.jpa.repository.JpaRepository
import javax.swing.text.html.HTML.Tag

interface TagRepositroy : JpaRepository<Tag, Long>