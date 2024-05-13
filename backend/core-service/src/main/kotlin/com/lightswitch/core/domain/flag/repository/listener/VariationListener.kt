package com.lightswitch.core.domain.flag.repository.listener

/**
 * Entity Listener에서 Spring Data JPA Repository를 사용하려면 컨텍스트 관리 문제가 있습니다.
 * Entity Listener는 Spring의 빈 수명 주기에 포함되어 있지 않기 때문에 직접적으로 Spring 빈을 주입받을 수 없습니다.
 * 그러나, 몇 가지 방법을 통해 이 문제를 해결할 수 있습니다.
 *
 * 1. ApplicationContext를 통한 접근
 * 2. BeanResolver를 사용하여 접근
 * 3. Spring의 DependencyInjectionBeanPostProcessor 사용
 *
 * light switch에서는 ApplicationContext를 사용하여 해결하였습니다.
 */
class VariationListener {

//    @PrePersist
//    fun onPreUpdate(variation: Variation) {
//        val flag = variation.flag
//
//        // flag 생성 이후 사항만 history로 등록
//        if (flag.histories.isEmpty()) {
//            return
//        }
//
//        flag.histories.add(
//            History(
//                historyId = null,
//                action = HistoryType.UPDATE_VALUE,
//                flag = flag,
//                current = variation.value,
//                previous = null,
//            )
//        )
//    }
}