import json
import logging
import typing
from datetime import datetime, timezone

import requests
from requests.adapters import HTTPAdapter
from urllib3 import Retry
from .models import Flags, Flag
from .stream_manager import StreamManager, StreamEvent
from .exceptions import StreamDataError, InvalidJsonResponseError
from .utils import handle_event

DEFAULT_API_URL = 'http://localhost:8000/api/v1/'
DEFAULT_REALTIME_API_URL = 'http://localhost:8000/api/v1/sse/subscribe'
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
    flags: typing.Optional[Flags] = None

    # 초기화할 때
    # 1.모든 플래그를 가져와서 저장
    # 2.sdk 키로 subscribe post 해서 userkey 받고 : api/v1/sse/subscribe
    # 3.subscribe/userkey 로 sse연결
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
        # self.session.headers.update(
        #     **{"X-Environment-Key": environment_key}
        # )
        self.session.proxies.update(proxies or {})
        retries = retries or Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])

        api_url = api_url or DEFAULT_API_URL
        self.api_url = api_url

        sse_realtime_api_url = sse_realtime_api_url or DEFAULT_REALTIME_API_URL
        self.sse_realtime_api_url = sse_realtime_api_url

        self.request_timeout_seconds = request_timeout_seconds
        self.session.mount(self.api_url, HTTPAdapter(max_retries=retries))

        # event 처리 함수
        self.handle_event = self.process_stream_event_update

        # 필요 시 api_url 이외의 url 속성 할당
        self.environment_url = f"{self.api_url}environment"
        self.environment_flags_url = f"{self.api_url}sdk/init" # 현재는 이 주소만 정의됨 - 현재 환경의 모든 플래그 가져오기
        self.identity_flags_url = f"{self.api_url}identity"

        self.user_key = None

        # 모든 플래그 가져오기 -> self.flags에 값 할당
        self._initialize_environment(environment_key)
        # userkey 받아오기
        self.user_key = self._get_user_key(environment_key)
        # 받아온 userkey로 SSE 구독하기
        self.initialize_sse_stream_manager(self.user_key)

    def initialize_sse_stream_manager(self, user_key):
        stream_manager = StreamManager(
            stream_url=self.sse_realtime_api_url + "/" + user_key,
            on_event=self.handle_event,
            # lightswitch=self,
            request_timeout_seconds=self.request_timeout_seconds,
        )
        stream_manager.start()

    # sdk 키로 subscribe post 해서 userkey 받기
    def _get_user_key(self, environment_key):
        headers={
            'Content-Type': 'application/json',
        }
        payload={
            'sdkKey': environment_key
        }
        response = self.session.post(
            url=self.sse_realtime_api_url,
            headers=headers,
            json=payload
        )
        if response.status_code == 200:
            data = response.json()
            user_key = data['data']['userKey']
            return user_key
        else:
            raise Exception(f"userKey를 받아오는 데 실패했습니다. 상태 코드: {response.status_code}")

    def _initialize_environment(self, environment_key: typing.Optional[str]) -> None:
        Lightswitch.flags = self._get_all_environment_flags_from_api(environment_key)

    # 새로운 SSE event를 받았을 때 EventStreamManager 스레드에 의해 호출되는 메서드
    # SSE 응답을 매개변수로 받아 이벤트 타입에 따라 플래그 목록을 동기화
    # response 형식은 다음과 같음
    '''
    {
      "userKey": "string",
      "type": "CREATE",
      "data": {}
    }
    '''
    def process_stream_event_update(self, event: StreamEvent) -> None:
        try:
            new_stream_event = json.loads(event.data)
            print("new_stream_event : ", new_stream_event)
            event_type = new_stream_event.get('type')  # 예를 들어 CREATE
            print("event-type : ", event_type)
            new_flag_data = new_stream_event['data']
            print("new_flag_data : ", new_flag_data)

            if event_type == "CREATE":
                new_flag = Flag.flag_from_api(new_flag_data)
                self.add_flag(new_flag)

            elif event_type == "UPDATE":
                new_flag = Flag.flag_from_api(new_flag_data)
                title = new_flag.title
                self.update_flag(title, new_flag)

            elif event_type == "SWITCH":
                self.toggle_flag(new_flag_data['title'])
            else: # DELETE
                self.delete_flag(new_flag_data['title'])

        except json.JSONDecodeError as e:
            raise StreamDataError("new_stream_event로부터 유효한 json 데이터를 가져오는데 실패하였습니다.") from e

        # try:
        #     stream_updated_at = datetime.fromtimestamp(new_stream_event.get("updated_at"), timezone.utc)
        # except TypeError as e:
        #     raise StreamDataError("new_stream_event로부터 유효한 타임스탬프를 가져오지 못했습니다.")
        #
        # if stream_updated_at.tzinfo is None:
        #     stream_updated_at = stream_updated_at.astimezone(timezone.utc)

        # if not self._environment:
        #     raise ValueError("환경에 접근할 수 없습니다. 환경 속성값이 null일 수 없습니다.")

        # environment_updated_at = self._environment.updated_at
        # if environment_updated_at.tzinfo is None:
        #     environment_updated_at = environment_updated_at.astimezone(timezone.utc)
        # if stream_updated_at > environment_updated_at:
        #     self.update_environment()

    def add_flag(self, new_flag : Flag):
        # flag_title = new_flag.get_attribute_value('title')
        if self.flags is None:  # Check if _flags is empty
            self.flags = Flags()
        # self._flags[flag_title] = new_flag
        # _flags에 플래그 추가
        self.flags.add_flag(new_flag)

    def update_flag(self, title, new_data):
        self.flags.update_flag_value(title, new_data)

    def delete_flag(self, title):
        self.flags.delete_flag_by_name(title)

    def toggle_flag(self, title):  # 플래그 활성화 상태 변경
        self.flags.toggle_flag_activation(title)
    # 현재 환경의 플래그 데이터를 모두 담고 있는 Flags 인스턴스 반환
    # def get_all_environment_flags(self) -> Flags:
    #     return self._get_all_environment_flags_from_api()

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
    def _get_all_environment_flags_from_api(self, environment_key) -> Flags:
        try:
            data = {
                "sdkKey": environment_key
            }
            json_response: typing.List[typing.Mapping[str, JsonType]] = (
                self._get_json_response(url=self.environment_flags_url, method="POST", body=data)['data']
            )
            print("json res: ", json_response)
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
        method: str,
        body: typing.Optional[typing.Dict[str, typing.Any]] = None
    ) -> JsonType:
        try:
            request_method = getattr(self.session, method.lower())
            headers = {}
            if body is not None and method.upper() == "POST":
                headers["Content-Type"] = "application/json"
                response = request_method(
                    url,
                    data=json.dumps(body),
                    headers=headers,
                    timeout=self.request_timeout_seconds
                )
            else:
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




