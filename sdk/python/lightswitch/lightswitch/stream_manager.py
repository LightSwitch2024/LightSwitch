import logging
import threading
import typing
from typing import Callable, Generator, Optional, Protocol, cast

import requests
import sseclient

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
        self._stop_event = threading.Event()  # threading event로 초기화(스레드의 lifecycle을 관리하기 위함)
        self.stream_url = stream_url
        self.on_event = on_event # 이벤트 발생 시 호출될 함수
        self.request_timeout_seconds = request_timeout_seconds

    def run(self) -> None:
        while not self._stop_event.is_set():
            try:
                # response = requests.get(self.stream_url, stream=True)
                # print("res", response)
                sse_client = sseclient.SSEClient(self.stream_url, headers={"Accept": "application/json, text/event-stream"}, timeout=None)
                # sse_client = sseclient.SSEClient(
                #     self.stream_url,
                #     headers={"Accept": "application/json, text/event-stream"},
                #     timeout=None
                # )
                print("sse client 출력", sse_client)
                for event in sse_client:
                    print(f"Event: {event.event}")
                    print(f"Data: {event.data}")
                    self.on_event(event)
                # for event in sse_client:
                #     print("event 출력", event.data)
                #     self.on_event(event)

            except requests.exceptions.ReadTimeout:
                pass
            except (StreamDataError, requests.RequestException):
                logger.exception('Error while streaming data')

    # run 메서드의 루프를 종료시키고 스레드도 종료
    def stop(self) -> None:
        self._stop_event.set()

    def __del__(self) -> None:
        self._stop_event.set()