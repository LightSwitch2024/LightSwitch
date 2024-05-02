import logging

import requests

from stream_manager import StreamManager, StreamEvent


def handle_event(event: StreamEvent) -> None:
    print(f"Received event: {event.event}, {event.data}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    # stream_url = "http://localhost:8000/api/v1/sse/subscribe/bb187ede10ae1e13c329fb31337517df6d1e2b900b947865069cb6e4fd2ae15f"
    stream_url = "http://localhost:8000/events"
    stream_manager = StreamManager(
        stream_url=stream_url,
        on_event=handle_event,
        request_timeout_seconds=10
    )


    # 스레드 시작
    stream_manager.start()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        stream_manager.stop()
        stream_manager.join()