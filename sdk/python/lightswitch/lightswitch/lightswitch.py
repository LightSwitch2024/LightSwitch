import json
import typing


import requests
from requests.adapters import HTTPAdapter
from urllib3 import Retry
from .models import Flags, Flag, LSUser
from .stream_manager import StreamManager, StreamEvent
from .exceptions import StreamDataError, LSServerError, LSTypeCastError, LSFlagNotFoundError


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
    _instance = None
    flags: typing.Optional[Flags] = None
    environment_key: typing.Optional[str] = None

    @classmethod
    def get_instance(cls, **kwargs):
        if cls._instance is None:
            cls._instance = cls(**kwargs)
        return cls._instance

    def __init__(
        self,
        api_url: typing.Optional[str] = None,
        sse_realtime_api_url: typing.Optional[str] = None,
        request_timeout_seconds: typing.Optional[int] = None,
        update_frequency_seconds:typing.Union[int, float] = 10,
        retries: typing.Optional[Retry] = None,
        proxies: typing.Optional[typing.Dict[str, str]] = None,
    ) -> None:

        self.update_frequency_seconds = update_frequency_seconds

        self.session = requests.Session()
        self.session.proxies.update(proxies or {})
        retries = retries or Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])

        api_url = api_url or DEFAULT_API_URL
        self.api_url = api_url

        sse_realtime_api_url = sse_realtime_api_url or DEFAULT_REALTIME_API_URL
        self.sse_realtime_api_url = sse_realtime_api_url

        self.request_timeout_seconds = request_timeout_seconds
        self.session.mount(self.api_url, HTTPAdapter(max_retries=retries))

        self.handle_event = self.process_stream_event_update

        # self.environment_url = f"{self.api_url}environment"
        self.environment_flags_url = f"{self.api_url}sdk/init"
        # self.identity_flags_url = f"{self.api_url}identity"

        self.user_key = None
        self.stream_manager = None

    def init(self, environment_key: str) -> None:
        self.environment_key = environment_key
        self._initialize_environment(environment_key)
        self.user_key = self._get_user_key(environment_key)
        self.initialize_sse_stream_manager(self.user_key)

    def initialize_sse_stream_manager(self, user_key: str):
        self.stream_manager = StreamManager(
            stream_url=self.sse_realtime_api_url + "/" + user_key,
            on_event=self.handle_event,
            request_timeout_seconds=self.request_timeout_seconds,
        )
        self.stream_manager.start()

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
        raise LSServerError(
            f"LightSwitch 서버와 통신에 실패했습니다. "
            f"userKey를 받아오는 데 실패했습니다. "
            f"Response status code: {response.status_code}"
        )

    def _initialize_environment(self, environment_key: typing.Optional[str]) -> None:
        Lightswitch.flags = self._get_all_environment_flags_from_api(environment_key)

    def process_stream_event_update(self, event: StreamEvent) -> None:
        try:
            new_stream_event = json.loads(event.data)
            # print("new_stream_event : ", new_stream_event)
            event_type = new_stream_event.get('type')
            # print("event-type : ", event_type)
            new_flag_data = new_stream_event['data']
            # print("new_flag_data : ", new_flag_data)

            if event_type == "CREATE":
                new_flag = Flag.flag_from_api(new_flag_data)
                self.add_flag(new_flag)

            elif event_type == "UPDATE":
                new_flag = Flag.flag_from_api(new_flag_data)
                title = new_flag.title
                self.update_flag(title, new_flag)

            elif event_type == "SWITCH":
                self.toggle_flag(new_flag_data)

            else:
                self.delete_flag(new_flag_data['title'])

        except json.JSONDecodeError as e:
            raise StreamDataError(
                "new_stream_event로부터 유효한 json 데이터를 가져오는데 실패하였습니다."
            ) from e

    def add_flag(self, new_flag: Flag):
        if self.flags is None:
            self.flags = Flags()
        self.flags.add_flag(new_flag)

    def update_flag(self, title, new_data):
        self.flags.update_flag_value(title, new_data)

    def delete_flag(self, title):
        self.flags.delete_flag_by_name(title)

    def toggle_flag(self, new_flag):  # 플래그 활성화 상태 변경
        self.flags.toggle_flag_activation(new_flag)

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
            raise LSServerError(
                "LightSwitch 서버와 통신에 실패했습니다."
                "응답 데이터가 유효한 JSON 타입이 아닙니다."
            ) from e

    def get_flag(self, flag_title: str, user: LSUser, default_value: typing.Any) -> typing.Any:
        try:
            flag = self.flags.get_flag_by_name(flag_title)
        except LSFlagNotFoundError:
            return default_value

        value_if_is_targeted = flag.get_user_variation_by_keyword(user)
        if not value_if_is_targeted:
            return flag.get_user_variation_by_percentile(user)
        return value_if_is_targeted

    def get_boolean_flag(self, flag_title: str, user: LSUser, default_value: bool) -> bool:
        try:
            flag = self.flags.get_flag_by_name(flag_title)
        except LSFlagNotFoundError:
            return default_value

        if flag.type != "BOOLEAN":
            raise LSTypeCastError(flag_title, "BOOLEAN")
        return self.get_flag(flag_title, user, default_value)

    def get_number_flag(self, flag_title: str, user: LSUser, default_value: int) -> int:
        try:
            flag = self.flags.get_flag_by_name(flag_title)
        except LSFlagNotFoundError:
            return default_value

        if flag.type != "INTEGER":
            raise LSTypeCastError(flag_title, "INTEGER")
        return self.get_flag(flag_title, user, default_value)

    def get_string_flag(self, flag_title: str, user: LSUser, default_value: str) -> str:
        try:
            flag = self.flags.get_flag_by_name(flag_title)
        except LSFlagNotFoundError:
            return default_value

        if flag.type != "STRING":
            raise LSTypeCastError(flag_title, "STRING")
        return self.get_flag(flag_title, user, default_value)

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
                raise LSServerError(
                    "LightSwitch 서버와 통신에 실패했습니다."
                    "유효하지 않은 request 입니다." 
                    f"Response status code: {response.status_code}"
                )
            return response.json()
        except (requests.ConnectionError, json.JSONDecodeError) as e:
            raise LSServerError(
                "LightSwitch 서버와 통신에 실패했습니다."
                "Lightswitch API로부터 유효한 response를 받지 못하였습니다."
            ) from e

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
        self.user_key = None

        # 세션 종료
        self.session.close()

