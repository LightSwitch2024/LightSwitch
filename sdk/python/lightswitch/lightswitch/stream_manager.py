import logging
import threading
import typing
from typing import Callable, Generator, Optional, Protocol, cast

import requests
import sseclient

from lightswitch.lightswitch.exceptions import StreamDataError

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
        self.on_event = on_event
        self.request_timeout_seconds = request_timeout_seconds

        def run(self) -> None:
            while not self._stop_event.is_set():
                try:
                    with requests.get(
                        self.stream_url,
                        stream=True,
                        headers={"Accept": "application/json, text/event-stream"},
                        timeout=self.request_timeout_seconds
                    ) as r: # r 객체는 HTTP 응답임
                        sse_client = sseclient.SSEClient(
                            # HTTP 응답 객체를 Generator[bytes, None, None]타입으로 변환
                            # -> 메모리 사용의 효율성을 높이는 방식으로 byte 데이터를 생성하고 반환
                            cast(Generator[bytes, None, None], r)
                        )
                        for event in sse_client.events(): # SSE 스트림에서 이벤트를 반복해서 읽어옴
                            self.on_event(event) # event는 StreamEvent 객체
                except requests.exceptions.ReadTimeout:
                    pass
                except (StreamDataError, requests.RequestException):
                    logger.exception('Error while streaming data')

        # run 메서드의 루프를 종료시키고 스레드도 종료
        def stop(self) -> None:
            self._stop_event.set()

        def __del__(self) -> None:
            self._stop_event.set()