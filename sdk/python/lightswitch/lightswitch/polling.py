from __future__ import annotations

import logging
import threading
import time
import typing

import requests

from flagsmith.exceptions import FlagsmithAPIError

# 조건부로 flagsmith 클래스를 import - 타입 확인 중에만 해당 클래스가 import되게함
if typing.TYPE_CHECKING:
    from flagsmith import Flagsmith

# 현재 모듈의 logger instance를 생성
logger = logging.getLogger(__name__)

# main Flagsmith instance의 환경 데이터를 주기적으로 업데이트
class EnvironmentDataPollingManager(threading.Thread):
    # 생성자 함수
    def __init__(
        self,
        *args: typing.Any, # 부모 클래스인 threading.Thread의 생성자로 전달됨
        main: Flagsmith, # Flagsmith 클래스의 인스턴스
        refresh_interval_seconds: typing.Union[int, float] = 10, # 환경 데이터가 업데이트 될 주기
        **kwargs: typing.Any,
    ):
        super(EnvironmentDataPollingManager, self).__init__(*args, **kwargs) # 부모 클래스의 생성자를 호출하여 인자를 전달
        self._stop_event = threading.Event() # 스레드에 멈춤 신호를 보낼 인스턴스 
        self.main = main
        self.refresh_interval_seconds = refresh_interval_seconds

    # 부모 클래스의 run method override - 환경 데이터 업데이트
    def run(self) -> None:
        while not self._stop_event.is_set(): # 루프 시작 - 스레드에 멈춤 신호가 보내지지 않은 한 반복
            try:
                self.main.update_environment() # 환경 데이터 업데이트
            except (FlagsmithAPIError, requests.RequestException): # update_environment 호출 중에 해당 에러나 예외 발생 시, 
                logger.exception("Failed to update environment") # 에러나 예외 상황 로그 기록 
            time.sleep(self.refresh_interval_seconds) # 반복작업을 재개하기 전에 delay 주기

    # 스레드에 멈춤 신호를 보내는 메서드
    def stop(self) -> None:
        self._stop_event.set()
    # EnvironmentDataPollingManager클래스의 destructor - 해당 클래스의 인스턴스가 삭제될 때, 스레드에 멈춤 신호 보내기 
    def __del__(self) -> None:
        self._stop_event.set()

# update_environment() : 플래그의 최신 설정에 관한 데이터를 가져와서 로컬 데이터를 업데이트
# EnvironmentDataPollingManager 클래스의 인스턴스가 만들어지면 부모 클래스로부터 상속받은
# start 메서드를 호출하여 동작을 수행할 것이며, 인스턴스를 삭제하거나 stop메서드를 호출하여 동작을 중단할 수 있다. 