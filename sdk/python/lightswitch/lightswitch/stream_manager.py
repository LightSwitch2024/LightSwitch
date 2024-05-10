import logging
import threading
import typing
from typing import Callable, Optional, Protocol

import requests

from .custom_sseclient import CustomSSEClient
from .exceptions import StreamDataError

logger = logging.getLogger(__name__)


class StreamEvent(Protocol):
    data: str


class StreamManager(threading.Thread):
    def __init__(
        self,
        *args: typing.Any,
        stream_url: str,
        on_event: Callable[[StreamEvent], None],
        request_timeout_seconds: Optional[int] = None,
        **kwargs: typing.Any
    ) -> None:
        super().__init__(*args, **kwargs)
        # self.lightswitch = lightswitch
        self._stop_event = threading.Event()  # threading event로 초기화(스레드의 lifecycle을 관리하기 위함)
        self.stream_url = stream_url
        self.on_event = on_event # 이벤트 발생 시 호출될 함수
        self.request_timeout_seconds = request_timeout_seconds

    def run(self) -> None:
        while not self._stop_event.is_set():
            try:
                sse_client = CustomSSEClient(self.stream_url, headers={"Accept": "application/json, text/event-stream"}, timeout=None)

                for event in sse_client:
                    # print("event 발생!", event, "여기까지 EVENT")
                    if hasattr(event, 'event'):
                        print(f"Event: {event.event}")
                    if hasattr(event, 'data'):
                        print(f"Data: {event.data}")
                    if hasattr(event, 'type'):
                        print(f"Type: {event.type}")
                    if event.data.strip():  # data 내용이 있는 경우에만
                        # print("이벤트 발생")
                        if event.data != 'SSE connected':
                            self.on_event(event)  # process_stream_event_update() 호출

            except requests.exceptions.ReadTimeout:
                pass
            except (StreamDataError, requests.RequestException):
                logger.exception('Error while streaming data')

    # run 메서드의 루프를 종료시키고 스레드도 종료
    def stop(self) -> None:
        self._stop_event.set()

    def __del__(self) -> None:
        self._stop_event.set()