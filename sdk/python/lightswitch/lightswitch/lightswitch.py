import json
import typing


import requests
from requests.adapters import HTTPAdapter
from urllib3 import Retry
from .models import Flags, Flag, LSUser
from .stream_manager import StreamManager, StreamEvent
from .exceptions import StreamDataError, InvalidJsonResponseError


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


class Lightswitch:
    """
    lightswitch http API와 통신하는 interface를 제공
    """
    flags: typing.Optional[Flags] = None

    # 초기화할 때
    # 1.모든 플래그를 가져와서 저장
    # 2.sdk 키로 subscribe post 해서 userkey 받고 : api/v1/sse/subscribe
    # 3.subscribe/userkey 로 sse 연결
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

        self._environment: typing.Optional[typing.Any] = None
        self.update_frequency_seconds = update_frequency_seconds

        if not environment_key:
            raise ValueError("환경 키가 필요합니다.")

        self.session = requests.Session()
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
        self.environment_flags_url = f"{self.api_url}sdk/init"  # 현재는 이 주소만 정의됨 - 현재 환경의 모든 플래그 가져오기
        self.identity_flags_url = f"{self.api_url}identity"

        self.user_key = None
        self.stream_manager = None

        # 모든 플래그 가져오기 -> self.flags에 값 할당
        self._initialize_environment(environment_key)
        # userkey 받아오기
        self.user_key = self._get_user_key(environment_key)
        # 받아온 userkey로 SSE 구독하기
        self.initialize_sse_stream_manager(self.user_key)

    def initialize_sse_stream_manager(self, user_key):
        self.stream_manager = StreamManager(
            stream_url=self.sse_realtime_api_url + "/" + user_key,
            on_event=self.handle_event,
            request_timeout_seconds=self.request_timeout_seconds,
        )
        self.stream_manager.start()

    # sdk 키로 subscribe post 해서 userkey 받기
    def _get_user_key(self, environment_key):
        headers = {
            'Content-Type': 'application/json',
        }
        payload = {
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
        raise requests.exceptions.HTTPError(f"userKey를 받아오는 데 실패했습니다. 상태 코드: {response.status_code}")

    def _initialize_environment(self, environment_key: typing.Optional[str]) -> None:
        Lightswitch.flags = self._get_all_environment_flags_from_api(environment_key)

    # 새로운 SSE event를 받았을 때 EventStreamManager 스레드에 의해 호출되는 메서드
    # SSE 응답을 매개변수로 받아 이벤트 타입에 따라 플래그 목록을 동기화
    '''
    response 형식은 다음과 같음
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
                self.delete_flag(new_flag_data['flagTitle'])

        except json.JSONDecodeError as e:
            raise StreamDataError("new_stream_event로부터 유효한 json 데이터를 가져오는데 실패하였습니다.") from e

    def add_flag(self, new_flag: Flag):
        if self.flags is None:
            self.flags = Flags()
        # flags에 플래그 추가
        self.flags.add_flag(new_flag)

    def update_flag(self, title, new_data):
        self.flags.update_flag_value(title, new_data)

    def delete_flag(self, title):
        self.flags.delete_flag_by_name(title)

    def toggle_flag(self, title):  # 플래그 활성화 상태 변경
        self.flags.toggle_flag_activation(title)

    # 해당 환경의 플래그 데이터 모두 가져오기
    def _get_all_environment_flags_from_api(self, environment_key) -> Flags:
        try:
            data = {
                "sdkKey": environment_key
            }
            json_response: typing.List[typing.Mapping[str, JsonType]] = (
                self._get_json_response(url=self.environment_flags_url, method="POST", body=data)['data']
            )
            return Flags.flags_from_api(
                flags_data=json_response
            )
        except json.JSONDecodeError as e:
            # logging.error(f"API 요청 중 에러 발생: {e}")
            raise InvalidJsonResponseError("응답 데이터가 유효한 JSON 타입이 아닙니다.") from e

    # 플래그 이름과 유저 모델 받아서 해당 유저의 플래그 변량 반환
    def get_flag(self, flag_title: str, user: LSUser) -> typing.Any:
        flag = self.flags.get_flag_by_name(flag_title)
        value_if_is_targeted = flag.get_user_variation_by_keyword(user)
        if not value_if_is_targeted:  # 키워드에 해당하지 않으면
            return flag.get_user_variation_by_percentile(user)
        return value_if_is_targeted

    def get_boolean_flag(self, flag_title: str, user: LSUser) -> bool:
        flag = self.flags.get_flag_by_name(flag_title)
        if flag.type != "BOOLEAN":
            raise TypeError(f"Flag '{flag_title}'의 데이터 타입이 BOOLEAN이 아닙니다.")
        return self.get_flag(flag_title, user)

    def get_number_flag(self, flag_title: str, user: LSUser) -> int:
        flag = self.flags.get_flag_by_name(flag_title)
        if flag.type != "INTEGER":
            raise TypeError(f"Flag '{flag_title}'의 데이터 타입이 INTEGER가 아닙니다.")
        return self.get_flag(flag_title, user)

    def get_string_flag(self, flag_title: str, user: LSUser) -> str:
        flag = self.flags.get_flag_by_name(flag_title)
        if flag.type != "STRING":
            raise TypeError(f"Flag '{flag_title}'의 데이터 타입이 STRING이 아닙니다.")
        return self.get_flag(flag_title, user)

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
                    "유효하지 않은 request 입니다. Response status code: %d" % response.status_code
                )
            return response.json()
        except (requests.ConnectionError, json.JSONDecodeError) as e:
            raise InvalidJsonResponseError("Lightswitch API로부터 유효한 response를 받지 못하였습니다.") from e

    def destroy(self):
        """
        서버와의 SSE 연결을 해제하고 모든 정보를 초기화
        """
        # SSE 연결 해제
        if self.stream_manager is not None:
            self.stream_manager.stop()

        # 플래그 정보 초기화
        self.flags = None

        # 그 외 모든 정보 초기화
        self._environment = None
        self.user_key = None

        # 세션 종료
        self.session.close()

