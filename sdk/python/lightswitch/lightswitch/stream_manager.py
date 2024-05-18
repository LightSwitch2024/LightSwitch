import logging
import threading
import typing
from typing import Callable, Optional, Protocol

import requests

from custom_sseclient import CustomSSEClient
from exceptions import StreamDataError

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
        self._stop_event = threading.Event()
        self.stream_url = stream_url
        self.on_event = on_event
        self.request_timeout_seconds = request_timeout_seconds

    def run(self) -> None:
        while not self._stop_event.is_set():
            try:
                sse_client = CustomSSEClient(self.stream_url, headers={"Accept": "application/json, text/event-stream"}, timeout=None)

                for event in sse_client:
                    if event.data.strip():
                        if event.data != 'SSE connected':  # 이후 버전에서 수정 필요
                            self.on_event(event)

            except requests.exceptions.ReadTimeout:
                pass
            except (StreamDataError, requests.RequestException):
                logger.exception('Error while streaming data')

    def stop(self) -> None:
        self._stop_event.set()

    def __del__(self) -> None:
        self._stop_event.set()
