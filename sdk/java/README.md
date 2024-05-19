# LightSwitch Java SDK

LightSwitch는 오픈소스 피쳐플래깅 솔루션으로, 가볍고 편리하게 A/B Test, Target Test를 지원합니다.
LightSwitch는 Docker Image 형태로 배포되어 편리하게 서비스와 통합 가능하며, 현재 Java, JavaScript, Python 언어를 지원합니다.

LightSwitch Java SDK를 사용하면, Java를 사용하는 클라이언트에서 LightSwtich를 쉽게 이용할 수 있습니다.

<br>

- Gradle, Maven 지원
- A/B Test, Target Test 지원
- SDK 내부적으로 Default 값 지원
- SSE를 통해 플래그 변경을 실시간 감지

<br>
---

# LightSwitch Java 시작하기

## 플래그 반환 값 결정 시나리오

플래그의 반환 값 결정은 다음과 같은 우선순위를 갖고, 해당하는 반환 값을 반환합니다.

### 1. 플래그 존재 확인

- "플래그 키"에 해당하는 플래그가 존재하는지 확인합니다.
- 플래그가 존재하지 않는다면, SDK 메서드 호출시 설정한 Default 값이 반환합니다.

### 2. 플래그 상태 확인

- 해당 플래그가 Active 상태인지 확인합니다.
- 플래그의 상태가 Active가 아니라면, 플래그에서 수신한 Default 값이 반환합니다.

### 3. 플래그 키워드 확인

- 해당 플래그의 키워드와 LSUser의 키워드가 일치하는 지 확인합니다.
- 플래그 키워드의 모든 속성을 만족하는 LSUser를 사용한 경우, 해당 키워드의 반환 값을 반환합니다.

### 4. 비율 분배

- 앞선 조건에 해당되지 않는다면, LSUser에 설정한 ID값에 따라 백분율 분포가 임의 배정됩니다.
- 백분율 분포해는 MD-5 해시 알고리즘이 사용되며, 같은 ID를 갖는 LSUser는 항상 같은 값을 반환합니다.
- LSUser가 속한 백분율에 해당하는 변수 값을 반환합니다.

<br>

## LightSwitch Java SDK 의존성 설정

LightSwitch SDK를 이용하기 위해, 클라이언트의 빌드도구 `build.gradle`이나 `pom.xml`에 다음과 같은 의존성을 추가합니다.

### build.gradle

```java
implementation group:'kr.lightswitch.www',name:'lightswitch',version:'1.0.0'
```

### build.gradle.kt

```java
implementation("kr.lightswitch.www:lightswitch:1.0.0")
```

### pom.xml

```java
<dependency>
    <groupId>kr.lightswitch.www</groupId>
    <artifactId>lightswitch</artifactId>
    <version>1.0.0</version>
</dependency>
```

<br>

## 인스턴스 생성하기 `getInstance()`

LightSwitch는 항상 같은 값의 플래그를 얻어오기 위해, 싱글톤 인스턴스를 사용합니다.\
LightSwitch 인터페이스의 `getInstance()`를 호출하여 싱글톤 인스턴스를 생성할 수 있습니다.

사용 예시 :

```java
LightSwitch lightSwitch = LightSwitch.getInstance();
```

<br>

## Light Switch 초기화 `init()`

LightSwitch 서버에서 초기 플래그를 SDK 내부적으로 캐싱하기위해 **필수적으로** LightSwitch 서비스를 초기화 해야 합니다.\
`init()` 수행 시 입력받는 `config`는 아래와 같습니다.

```java
// @param sdkKey    : LightSwitch 서버에서 발급 받은 sdk Key
// @param serverUrl : 연결할 LightSwitch 서버 URL
void init(String sdkKey, String serverUrl);
```

사용 예시 :

```java
lightSwitch.init("your-private-sdk-key","https://lightswitch.kr");
```

<br>

## 식별자 `LSUser.class`

플래그에서 반환 값을 받아오기 위해서 클라이언트 유저의 기본적인 정보를 제공하는 `LSUser.class`를 선언해야 합니다.

`LSUser.class`는 Builder 패턴만을 지원하며, `userId`는 **필수 값**으로 지정해야 합니다.\
또한, 유저별로 속성을 지정하여 특정 유저만을 대상으로 한 타겟 테스팅을 수행할 수 있습니다.

사용 예시 :

```java
LSUser lsUser = new LSUser.Builder("userId")
	.build();

LSUser lsUser = new LSUser.Builder("123")
	.property("name", "LightSwitch") // 속성 : 값
	.property("address", "seoul")   // 키워드에 매칭된다.
	.build();
```

<br>

## 플래그 반환 값 `getFlag()`, `get<T>Flag()`

플래그의 반환 값을 얻는 메서드는 타입 안정성을 보장하는 메서드와 보장하지 않는 메서드로 나누어집니다.

```java
// 타입을 알 수 없음
<T> T getFlag(String key, LSUser LSUser, Object defaultValue);

// 타입 안정성 보장
Boolean getBooleanFlag(String key, LSUser LSUser, Boolean defaultValue);

Integer getNumberFlag(String key, LSUser LSUser, Integer defaultValue);

String getStringFlag(String key, LSUser LSUser, String defaultValue);
```

`getFlag()`는 타입 안정성을 보장하지 않습니다.\
만약 반환 받은 플래그의 반환 값 타입이 일치하지 않는다면, `Java.lang.ClassCastException` 예외를 던지기 때문에 `try/catch`를 적적히 수행해야 합니다.

타입 안정성을 보장하는 메서드로 플래그를 얻어올 때, 해당 플래그의 타입과 메서드 유형이 일치하지 않는다면 `defaultValue`를 반환합니다.\
또한, 플래그의 `key`와 일치하는 이름의 플래그가 없을 경우에도 `defaultValue`를 반환합니다.

사용 예시 :

```java
boolean typeUnsafeFlag = lightswitch.getFlag("flag-name", user, false);
boolean typeSafeFlag = lightswitch.getBooleanFlag("flag-name", user, false);
```

<br>

## Light Switch 사용 해제 `destroy()`

LightSwitch 서비스와의 연결을 런타임에 해제하고 싶은 경우 `destroy()`를 이용하여 연결을 해제할 수 있습니다.\
캐싱된 모든 플래그도 초기화 됨에 유의해야합니다.

`destroy()`가 호출 될 경우 다음과 같은 작업들이 이루어 집니다.

- Lightswitch Connection 연결 해제
- Lightswitch SSE 연결 해제
- 캐싱된 플래그 초기화

```java
void destroy();
```

사용 예시 :

```java
lightSwitch.destroy();
```

<br>

# LightSwitch 활용

## 플래그 실시간 변경

LightSwitch SDK는 내부적으로 SSE(Server Sent Event) 통신을 통해 서버로부터 플래그 변경사항을 실시간으로 감지합니다.\
따라서, 사용자는 변경된 플래그를 새로 받아오기 위해서 아무런 작업도 할 필요가 없습니다.

<br>

## 플래그 키워드 `타겟 테스팅`

LightSwitch는 플래그의 키워드와 속성을 통해 타겟 테스팅을 지원합니다.

먼저, 웹 대시보드를 통해 플래그의 키워드를 설정할 수 있습니다.\
하나의 키워드에는 하나의 반환 값이 있으며, 포함된 속성을 모두 만족해야 키워드 조건을 만족한 것으로 간주합니다.

키워드 설정이 완료 됐다면, 플래그를 얻어올 때 `LSUser.class`의 속성`[속성:값]`을 설정할 수 있습니다.\
`LSUser.class`의 속성`[속성:값]`이 키워드에 포함된 속성에 모두 포함되어 있을 경우, 키워드 반환 값을 반환합니다.\
키워드에 포함된 속성을 일부만 포함하고 있거나 포함하지 않는 경우, `플래그 변수 비율`방법에 따라 값을 반환합니다.

사용 예시 :

```java
LSUser lsUser = new LSUser.Builder("123")
	.property("name", "olrlobt")
	.property("age", "27")
	.build();

Boolean flagTest = lightSwitch.getBooleanFlag("FLAG TEST", lsUser, false);
```

위 예시에서 플래그의 키워드 속성이 `[name : olrlobt]`와 `[age : 27]`를 모두 만족하면 키워드 반환 값을 반환합니다.\
또한 플래그의 키워드 속성이 `[name : olrlobt]`와 `[age : 27]`를 둘 중 하나만 만족해도 키워드 반환 값을 반환합니다.\

하지만, 플래그의 키워드 속성이 `[name : olrlobt]`와 `[age : 27]` 외에도 `[company : ssafy]`를 갖고 있다면, 키워드 반환 값을 반환하지 않고
`플래그 변수 비율` 방법에 따라 반환 값을 반환합니다.

<br>

## 플래그 변수 비율 `A/B 테스트`, `카나리 배포`

LightSwitch는 플래그 변수 비율을 실시간으로 조절하며 다양하게 활용할 수 있습니다.\
변수 비율은 플래그를 얻을 때 사용하는 `LSUser.class`의 필수 `userId`에 따라 해시(MD-5)값 백분율을 기반으로 합니다.

사용 예시 :

```java
// Flag Variation 1 : True : 50%
// Flag Variation 2 : False : 50%
LSUser lsUser = new LSUser.Builder("000") // User Hash : 54.72%
	.build();

LSUser lsUser2 = new LSUser.Builder("123") // User Hash : 03.17%
	.build();

Boolean flagTest = lightSwitch.getBooleanFlag("FLAG TEST", lsUser, false); // False
Boolean flagTest2 = lightSwitch.getBooleanFlag("FLAG TEST", lsUser2, false); // True
```

위 예시에서 플래그의 변수 비율이 50%, 50%의 비율로 설정이 되어 있다면, `LSUser.class`의 `userId` 값에의 해시값에 따라 반환 값이 달라질 수 있습니다.\
이를 적절히 활용하여, `A/B 테스트`, `카나리 배포` 등 여러 방면으로 활용할 수 있습니다.

<br>



