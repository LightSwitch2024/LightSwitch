import logging

from stream_manager import StreamManager, StreamEvent


def handle_event(event: StreamEvent) -> None:
    print(f"Received event: {event.data}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

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