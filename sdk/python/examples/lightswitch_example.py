import sys
import os
import json

# 현재 스크립트의 절대 경로
current_dir = os.path.dirname(os.path.abspath(__file__))
# 상위 디렉토리의 절대 경로
parent_dir = os.path.dirname(current_dir)
# lightswitch 모듈이 있는 경로를 sys.path에 추가
sys.path.append(os.path.join(parent_dir, 'lightswitch'))

from lightswitch.lightswitch import Lightswitch

# sdk 초기화 : Lightswitch 클래스의 인스턴스를 생성하여 사용
lightswitch = Lightswitch(
    environment_key="LIGHTSWITCH_SERVER_SIDE_ENVIRONMENT_KEY"
)

# 해당 환경의 플래그 데이터 전부 가져오기 - 최초에 DB의 데이터를 모두 가져오고, 그런 다음 SSE 연결
flags = lightswitch.get_all_environment_flags()
"""
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "flagId": 0,
      "title": "string",
      "description": "string",
      "type": "BOOLEAN",
      "keywords": [
        {
          "keyword": "string",
          "description": "string"
        }
      ],
      "defaultValueForKeyword": "string",
      "defaultPortionForKeyword": 0,
      "defaultDescriptionForKeyword": "string",
      "variationsForKeyword": [
        {
          "value": "string",
          "portion": 0,
          "description": "string"
        }
      ],
      "defaultValue": "string",
      "defaultPortion": 0,
      "defaultDescription": "string",
      "variations": [
        {
          "value": "string",
          "portion": 0,
          "description": "string"
        }
      ],
      "maintainerId": 0,
      "createdAt": "string",
      "updatedAt": "string",
      "deleteAt": "string",
      "active": true
    }
  ]
}
"""
# "PD-L1 22C3 Bladder"플래그가 켜져있는지 확인
new_Biomarker = flags.is_feature_enabled("PD-L1 22C3 Bladder")

if new_Biomarker: # 켜져있다면
    # "PD-L1 22C3 Bladder"플래그에 저장된 값을 가져오기 - dict
    new_Biomarker_data = json.loads(flags.get_feature_value_by_name("PD-L1 22C3 Bladder"))
    # 데이터 구조 예시
    """
        {
            "biomarker": "IO HE Pan",
            "code": "io-he-pan",
            "models": ["1.2.0", "1.2.1"]
        }
    """
else:
    print("new_Biomarker 기능이 활성화되어 있지 않습니다.")

# 특정 사용자의 플래그 데이터 가져오기
# 이메일로 사용자를 식별한다고 가정
identifier = "sumin@gmail.com"
flags_for_identity = lightswitch.get_flags_for_identity(identifier) # Flags 객체 반환
# 특정 사용자에게 해당 마커를 보여줄 것인지 여부
show_marker = flags_for_identity.is_feature_enabled("PD-L1 22C3 Bladder")


