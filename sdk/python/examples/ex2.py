import sys
import os
import json
from lightswitch.lightswitch import Lightswitch
from lightswitch.lightswitch.models import LSUser

# 현재 스크립트의 절대 경로
current_dir = os.path.dirname(os.path.abspath(__file__))
# 상위 디렉토리의 절대 경로
parent_dir = os.path.dirname(current_dir)
# lightswitch 모듈이 있는 경로를 sys.path에 추가
sys.path.append(os.path.join(parent_dir, 'lightswitch'))

new_lightswitch = Lightswitch().get_instance()
print(new_lightswitch.environment_key)
