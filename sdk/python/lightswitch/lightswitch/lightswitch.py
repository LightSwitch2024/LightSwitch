import json
import logging
import typing
from datetime import datetime, timezone

import requests
from requests.adapters import HTTPAdapter
from urllib3 import Retry
from lightswitch.lightswitch.models import Flags
from lightswitch.lightswitch.streaming import StreamEvent
from lightswitch.lightswitch.exceptions import StreamDataError, InvalidJsonResponseError

DEFAULT_API_URL = 'http://localhost:8000/api/v1/'
DEFAULT_REALTIME_API_URL = 'http://localhost:8000/api/sse/subscribe/a'
JsonType = typing.Union[
    None,
    int,
    str,
    bool,
    typing.List["JsonType"],
    typing.List[typing.Mapping[str, "JsonType"]],
    typing.Dict[str, "JsonType"],
]

# 플래그 관리 스프링 부트 서버와 통신
class Lightswitch:
    """
    lightswitch http API와 통신하는 interface를 제공
    """

    def __init__(
        self,
        environment_key: typing.Optional[str]= None,
        api_url: typing.Optional[str] = None,
        sse_realtime_api_url: typing.Optional[str] = None,
        request_timeout_seconds: typing.Optional[int] = None,
        update_frequency_seconds:typing.Union[int, float] = 10,
        retries: typing.Optional[Retry] = None,
        proxies: typing.Optional[typing.Dict[str, str]] = None,
    ) -> None:

        # 이 변수는 클래스 내부에서만 관리되고 사용됨
        self._environment: typing.Optional[typing.Any] = None
        self.update_frequency_seconds = update_frequency_seconds
        self._identity_overrides_by_identifier: typing.Dict[str, typing.Any] = {}

        if not environment_key:
            raise ValueError("환경 키가 필요합니다.")

        self.session = requests.Session()
        self.session.headers.update(
            **{"X-Environment-Key": environment_key}
        )
        self.session.proxies.update(proxies or {})
        retries = retries or Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])

        api_url = api_url or DEFAULT_API_URL
        self.api_url = api_url

        sse_realtime_api_url  = sse_realtime_api_url or DEFAULT_REALTIME_API_URL
        self.sse_realtime_api_url = sse_realtime_api_url

        self.request_timeout_seconds = request_timeout_seconds
        self.session.mount(self.api_url, HTTPAdapter(max_retries=retries))

        # 필요 시 api_url 이외의 url 속성 할당
        self.environment_url = f"{self.api_url}environment"
        self.environment_flags_url = f"{self.api_url}sdk/init" # 현재는 이 주소만 정의됨
        self.identity_flags_url = f"{self.api_url}identity"

    # 새로운 SSE event를 받았을 때 EventStreamManager 스레드에 의해 호출되는 메서드
    def process_stream_event_update(self, event: StreamEvent) -> None:
        try:
            new_stream_event = json.loads(event.data)
        except json.JSONDecodeError as e:
            raise StreamDataError("new_stream_event로부터 유효한 json 데이터를 가져오는데 실패하였습니다.") from e

        try:
            stream_updated_at = datetime.fromtimestamp(new_stream_event.get("updated_at"), timezone.utc)
        except TypeError as e:
            raise StreamDataError("new_stream_event로부터 유효한 타임스탬프를 가져오지 못했습니다.")

        if stream_updated_at.tzinfo is None:
            stream_updated_at = stream_updated_at.astimezone(timezone.utc)

        if not self._environment:
            raise ValueError("환경에 접근할 수 없습니다. 환경 속성값이 null일 수 없습니다.")

        environment_updated_at = self._environment.updated_at
        if environment_updated_at.tzinfo is None:
            environment_updated_at = environment_updated_at.astimezone(timezone.utc)
        if stream_updated_at > environment_updated_at:
            self.update_environment()

    # 현재 환경의 플래그 데이터를 모두 담고 있는 Flags 인스턴스 반환
    def get_all_environment_flags(self) -> Flags:
        return self._get_all_environment_flags_from_api()

    def get_flags_for_identity(
        self,
        identifier: str
    ) -> Flags:
        return self._get_flags_for_identity_from_api(identifier)

    def update_environment(self) -> None:
        self._environment = self._get_environment_from_api()
        self._update_user_flag_overrides()

    # 각 identifier별로 오버라이드 설정값을  self._identity_overrides_by_identifier 딕셔너리에저장한다.
    # 나중에 특정 사용자의 플래그 값을 결정할 때, 이 딕셔너리를 조회하여 사용자별로 설정된 오버라이드 값을 적용한다.
    def _update_user_flag_overrides(self) -> None:
        if not self._environment:
            return
        if overrides := self._environment.identity_overrides:
            self._identity_overrides_by_identifier = {
                identity.identifier: identity for identity in overrides
            }

    # Lightswitch API를 통해 원격저장소의 환경 데이터 가져오기
    def _get_environment_from_api(self) -> JsonType:
        environment_data = self._get_json_response(self.environment_url, method="GET")
        return environment_data # 나중에 응답 데이터 유효성 검사 로직 추가
    # 해당 환경의 플래그 데이터 모두 가져오기
    def _get_all_environment_flags_from_api(self) -> Flags:
        try:
            data = {
                "sdkKey": ""
            }
            json_response: typing.List[typing.Mapping[str, JsonType]] = (
                self._get_json_response(url=self.environment_flags_url, method="POST", body=data)
            )
            return Flags.flags_from_api(
                flags_data=json_response
            )
        except json.JSONDecodeError as e:
            logging.error(f"API 요청 중 에러 발생: {e}")
            raise InvalidJsonResponseError("응답 데이터가 유효한 JSON 타입이 아닙니다.") from e

    def _get_flags_for_identity_from_api(
        self,
        identifier: str
    ) -> Flags:
        try:
            data = None
            json_response: typing.Dict[str, typing.List[typing.Dict[str, JsonType]]] = (
                self._get_json_response(
                    url=self.identity_flags_url, method="GET"
                )
            )
            return Flags.flags_from_api(
                flags_data=json_response
            )
        except json.JSONDecodeError as e:
            raise InvalidJsonResponseError("응답 데이터가 유효한 JSON 타입이 아닙니다.") from e

    def _get_json_response(
        self,
        url: str,
        method: str
    ) -> JsonType:
        try:
            request_method = getattr(self.session, method.lower())
            response = request_method(
                url,
                timeout=self.request_timeout_seconds
            )
            if response.status_code != 200:
                raise InvalidJsonResponseError(
                    "유효하지 않은 request입니다. Response status code: %d",
                    response.status_code
                )
            return response.json()
        except (requests.ConnectionError, json.JSONDecodeError) as e:
            raise InvalidJsonResponseError("Lightswitch API로부터 유효한 response를 받지 못하였습니다.") from e



