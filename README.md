# **Lightswitch**

LightSwitch는 오픈소스 피쳐플래깅 솔루션으로, 가볍고 편리하게 A/B Test, Target Test를 
지원합니다. LightSwitch는 Docker Image 형태로 배포되어 편리하게 서비스와 통합 가능하며, 
현재 Java, JavaScript, Python 언어를 지원합니다.

Lightswitch is a lightweight Python library that allows you to easily implement 
feature toggles (also known as feature flags) in your Python applications. 
With Lightswitch, you can control the activation of features in your application 
remotely without requiring code changes or re-deployments.

## 사용 예시

### 특징

- A/B Test, Targeted Test를 지원합니다.
- SDK 내부적으로 Default 값을 지원합니다.
- SSE를 통해 플래그 변경을 실시간으로 감지합니다.

### 플래그 값 결정 시나리오

플래그 값 결정은 다음과 같이 진행합니다.

1. 해당 플래그가 존재하는지 확인합니다.

   1-1. 플래그가 존재하지 않는다면, SDK 이용시 설정한 Default 값을 활용합니다.

2. 해당 플래그에 keyword 속성이 존재하는지 확인합니다. Keyword 속성이 존재하는 경우,
이는 해당 플래그가 Targeted Test에 이용된다는 것을 의미합니다.

   2-1. keyword가 존재하고, LSUser 내부 properties와 일치하는 경우, 
   해당 키워드의 값을 활용합니다.

3. 해당 플래그의 variations 속성이 존재하는지 확인합니다.
variations 속성에는 백분율 범위와 해당 범위의 사용자에게 할당될 값이 저장되어 있습니다.

   3-1. 사용자 식별자와 플래그 이름을 이용하여 사용자가 플래그 별로 고유한 백분율 값(float)
   을 갖도록합니다. 해당 사용자의 백분율 값과 백분율 범위를 비교해 해당하는 variation 값을 
   활용합니다.

### LightSwitch Python SDK 설치

LightSwitch SDK를 이용하기 위해 필수적으로 프로젝트에 설치해야 합니다.

pip을 통한 설치:
```
pip install lightswitch_kr
```

poetry를 통한 설치:
```
poetry add lightswitch_kr
```
poetry add 명령어를 통해 lock파일에 의존성을 추가합니다.

### Quick Start

1.인스턴스 생성

LightSwitch는 동일한 sdk_key로 가져온 플래그의 무결성을 위해, 싱글톤 인스턴스를 사용합니다.
LightSwitch 인터페이스의 get_instance()를 호출하여 싱글톤 인스턴스를 생성할 수 있습니다.

```
lightswitch = LightSwitch.get_instance(); // LightSwitch 서비스 인스턴스 생성
```

인스턴스 생성 시 전달 가능한 인자
```
api_url: typing.Optional[str] = None, 
sse_realtime_api_url: typing.Optional[str] = None,
request_timeout_seconds: typing.Optional[int] = None,
update_frequency_seconds:typing.Union[int, float] = 10,
retries: typing.Optional[Retry] = None,
proxies: typing.Optional[typing.Dict[str, str]] = None,
```

전달하지 않은 경우 None이 할당되거나 내부적으로 DEFAULT_API_URL 처럼 기본값을 선언하여
속성 값으로 할당할 수 있습니다. 

2.초기화

서버에서 생성한 플래그를 얻기 위해 필수적으로 LightSwitch 서비스를 초기화 해야 합니다.
environment_key 인자 값은 필수입니다.

```
ls.init(environment_key=env_key)
```

### LightSwitch Python SDK 플래그 수신

LightSwitch의 경우 아래의 메서드를 통해 플래그를 수신할 수 있습니다.
flag_title를 인자로 전달해 특정 유저의 해당 플래그 값을 수신합니다.

```
get_flag(self, flag_title: str, user: LSUser, default_value: typing.Any) -> typing.Any;
get_boolean_flag(self, flag_title: str, user: LSUser, default_value: bool) -> bool;
def get_number_flag(self, flag_title: str, user: LSUser, default_value: int) -> int;
def get_string_flag(self, flag_title: str, user: LSUser, default_value: str) -> str;
```

플래그 값을 수신하기 이전에 해당 플래그의 활성화 여부만을 확인할 수 있습니다.
이때 플래그 이름을 인자로 전달하고 bool 값을 반환받습니다. 

```
is_new_feature_active = ls.flags.is_feature_enabled("new_tag")
```

### LightSwitch Python SDK 실시간 데이터 수신

LightSwitch SDK는 내부적으로 SSE 통신을 통해 서버로부터 플래그 변경사항을 실시간으로 
감지합니다.

init 호출 시에 StreamManager의 인스턴스를 생성하고 서버와 연결을 유지한 상태로 
서버로부터 이벤트 스트림을 받을 수 있습니다. 

process_stream_event_update에서 이벤트 스트림을 수신하여 처리합니다. 

### LightSwitch Python SDK 사용자 모델

만약 특정 사용자를 대상으로 피쳐 플래깅을 이용하고 싶다면 `LSUser` 클래스를 통해 
사용자의 정보를 입력하고, 해당 사용자에 대해 설정된 플래그를 수신할 수 있습니다.

```
user_id = 1
key = "memberId"
value = "1"

this_user = LSUser(user_id=user_id).set_property(key, value)
```
문자열 타입의 user_id와 딕셔너리 타입의 property = {"memberId" : "1"} 인 LSUser 클래스의
인스턴스가 생성됩니다.

LSUser 클래스로 애플리케이션 사용자를 식별하고 속성을 관리할 수 있습니다.
이때 각 사용자의 식별자인 user_id는 A/B Test에 속성의 key-value는 Targeted Test에서
사용자를 특정하고 그에 따라 플래그의 값을 지정하는데 사용됩니다. 

### LightSwitch Python SDK 연결 해제

서버와의 SSE 연결을 해제하고 모든 정보를 초기화할 수 있습니다.

```
lightswitch.destroy()
```
