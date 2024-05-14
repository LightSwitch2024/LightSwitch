package com.lightswitch.core.domain.flag.repository.listener

/**
 *  Update 모든 경우에 대해서 Listener를 반영하기 어려워서
 *  UPDATE_TITLE, UPDATE_TYPE, SWITCH에 대해서만 History를 FlagSerivce에 남기도록 하였습니다.
 */
class FlagListener {

//    @PrePersist
//    fun onPrePersist(flag: Flag) {
//        flag.histories.add(
//            History(
//                historyId = null,
//                flag = flag,
//                action = HistoryType.CREATE,
//                previous = null,
//                current = null
//            )
//        )
//    }
//
//    @PreUpdate
//    fun onPreUpdate(flag: Flag) {
//        if (flag.deletedAt != null) {
//            flag.histories.add(
//                History(
//                    historyId = null,
//                    flag = flag,
//                    action = HistoryType.DELETE,
//                    previous = null,
//                    current = null
//                )
//            )
//        }
//    }
}
