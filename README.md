# **Lightswitch**

* docker hub 배포 URL : https://hub.docker.com/repository/docker/lightswitch2024/lightswitch/general
* java script SDK 배포 URL : https://www.npmjs.com/package/lightswitch-js-sdk
* java SDK 배포 URL : https://central.sonatype.com/artifact/kr.lightswitch.www/lightswitch
* python SDK 배포 URL : https://pypi.org/project/lightswitch_kr/

## 소개
### Youtube
[![Light switch 소개 영상](https://img.youtube.com/vi/z0n_OoL4fzM/0.jpg)](https://www.youtube.com/watch?v=z0n_OoL4fzM?t=0s)

LightSwitch는 오픈소스 피쳐플래깅 솔루션으로, 가볍고 편리하게 A/B Test, Target Test를 
지원합니다. LightSwitch는 Docker Image 형태로 배포되어 편리하게 서비스와 통합 가능하며, 
현재 Java, JavaScript, Python 언어를 지원합니다.

## Light Switch 기능 활용
**Light Switch**를 활용하면 새로운 배포 버전에 대한 구체적인 roll back plan 없이도 배포할 수 있습니다. 개발자는 새로운 기능 개발에만 집중하여 프로젝트를 수행하게 됩니다. **Light Switch**는 일반적으로 다음과 같은 용도로 사용됩니다.
* 기능 플래그 토글
   - 배포된 환경에서 원하는 기능을 키고 끄는 기능
   - 키워드를 기반으로 특정 유저 지정 가능
   - 비율을 설정하여 다른 반환 값 지정 가능
* 카나리 배포
   - 새로 개발한 신기능을 일부 유저만 먼저 사용하게 하는 기능
   - 설정에 따라 점진적으로 신기능을 사용하는 유저 비율을 높임
   - 신기능의 오류 발생시, 조기 대처 가능
*  A/B 테스트
   - 다른 기능 세트를 갖는 여러 버전의 애플리케이션을 동시에 실행하여 어떤 기능이 우수한 성능을 보이는지 비교 분석 기능

## 다운로드
Light Switch는 여러 운영체제에서도 동일하게 활용 가능하도록 Docker 이미지 형태로 [Docker hub](https://hub.docker.com/repository/docker/lightswitch2024/lightswitch/general)에서 공식 배포판을 제공하고 있습니다.

## 기여
Light Switch에 기여하고 싶다면 [Contributing guideline]()을 따라주세요.

## 라이센스
Light Switch는 MIT 라이센스에 따라 라이센스를 받습니다.

