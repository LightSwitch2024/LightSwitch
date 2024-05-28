# LightSwitch JavaScript SDK

LightSwitch는 오픈소스 피쳐플래깅 솔루션으로, 가볍고 편리하게 A/B Test, Target Test를 지원합니다. 또한, Docker Image 형태로 배포되어 편리하게 서비스와 통합 가능하며, 현재 Java, JavaScript, Python 언어를 지원합니다.

## 사용 예시

### 특징

- TypeScript를 지원합니다.
- A/B Test, Target Test를 지원합니다.
- SDK 내부적으로 Default 값을 지원합니다.
- SSE를 통해 플래그 변경을 실시간으로 감지합니다.

### 플래그 값 결정 시나리오

플래그 값 결정은 다음과 같이 진행합니다.

1. 해당 플래그가 존재하는지 확인합니다.

   1-1. 플래그가 존재하지 않는다면, SDK 이용시 설정한 Default 값을 활용합니다.

2. 해당 플래그가 Active 상태인지 확인합니다.

   2-1. 플래그가 Active하지 않다면, 서버에서 수신한 Default 값을 활용합니다.

3. 해당 플래그에 keyword가 존재하는지 확인합니다.

   3-1. keyword가 존재하고, LSUser 내부 properties와 일치하는 경우, 해당 키워드의 값을 활용합니다.

4. 해당 플래그의 portion을 계산합니다.

   4-1. 사용자를 백분율로 나눠 속한 그룹을 계산 후, portion에 해당하는 Variation 값을 활용합니다.
   
### LightSwitch JavaScript SDK 설치

LightSwitch SDK를 이용하기 위해 필수적으로 프로젝트에 설치해야 합니다.

npm 환경

```
npm install lightswitch-js-sdk
```

yarn 환경

```
yarn install lightswitch-js-sdk
```

### LightSwitch JavaScript SDK 생성

LightSwitch는 항상 같은 값의 플래그를 얻어오기 위해, 싱글톤 인스턴스를 사용합니다. LightSwitch 인터페이스의 getInstance()를 호출하여 싱글톤 인스턴스를 생성할 수 있습니다. 

```
const lightswitch = LightSwitch.getInstance(); // LightSwitch 서비스 클래스 생성
```

### LightSwitch JavaScript SDK 초기화

서버에서 생성한 플래그를 얻기 위해 필수적으로 LightSwitch 서비스를 초기화 해야 합니다.

init 수행 시 입력받는 config는 아래와 같습니다.

sdkKey, onFlagChanged는 필수로 입력을 해야합니다.

```
sdkKey: string;                     // 웹 페이지에서 발급받은 sdk Key를 입력합니다.
onFlagChanged: flagChangedCallback; // 플래그 데이터 변경이 발생했을 때 호출됩니다.
endpoint?: string;                  // 서버 URL을 설정합니다.
logLevel?: LogLevel;                // 현재 사용되지 않습니다.
reconnectTime?: number;             // SSE 연결 재요청 시간을 설정합니다. default : 5초(5000)
onError?: ErrorCallback;            // 오류 처리를 원하는경우 사용합니다.
```

init 함수는 Promise<void> 타입을 반환합니다. init 함수 호출 후 서버에서 현재 플래그 목록을 모두 수신하므로, then chain을 활용하여 init이 완료 된 후 flag를 얻을 수 있습니다.

```
const lightswitch = LightSwitch.getInstance(); // LightSwitch 서비스 클래스 생성

lightswitch
      .init({
        sdkKey: "your sdk Key",
        onFlagChanged: () => {},
      })
      .then(() => {
        cosnt testFlag = lightswitch.getBooleanFlag("testFlag", user, false);
      })
      .catch((err) => {
        console.log(err);
      });
```

### LightSwitch JavaScript SDK 플래그 수신

LightSwitch의 경우 아래의 함수를 통해 플래그를 수신할 수 있습니다.

```
getFlag: <T>(name: string, LSUser: ILSUser, defaultVal: T) => T;
getBooleanFlag: (name: string, LSUser: ILSUser, defaultVal: boolean) => boolean;
getIntegerFlag: (name: string, LSUser: ILSUser, defaultVal: number) => number;
getStringFlag: (name: string, LSUser: ILSUser, defaultVal: string) => string;
getAllFlags: () => Flags;
```

특정 플래그를 얻어올 때 타입과 함께 flag를 얻을 경우, 해당 타입으로 캐스팅 가능한지 검사를 하므로, 더욱 안전하게 플래그를 얻어올 수 있습니다.

### LightSwitch JavaScript SDK 실시간 데이터 수신

LightSwitch SDK는 내부적으로 SSE 통신을 통해 서버로부터 플래그 변경사항을 실시간으로 감지합니다.

사용자는 실시간성이 필요한 경우, onFlagChanged 콜백에서 실시간으로 플래그의 변경을 수신할 수 있습니다.

### LightSwitch JavaScript SDK 타겟 테스팅

만약 특정 사용자를 대상으로 피쳐 플래깅을 이용하고 싶다면 `LSUser` 클래스를 통해 사용자의 정보를 입력하고, 해당 사용자에 대해 설정된 플래그를 수신할 수 있습니다.

```
const user = new LSUser("user-id", { // 사용자 정보 생성
name: "LightSwitch",
address: "seoul",
});

const testFlag = lightswitch.getBooleanFlag("test", user, true);
```

위 처럼 설정한 경우, 웹페이지의 키워드로 name이 'LightSWitch', address가 "seoul"인 사용자에 대해 특정 값을 제공할 수 있습니다.

### LightSwitch JavaScript SDK 연결 해제

LightSwitch의 SSE 연결을 해제하고 싶은 경우 아래의 명령어를 통해 SSE 연결을 해제할 수 있습니다.

```
lightswitch.destroy()
```
