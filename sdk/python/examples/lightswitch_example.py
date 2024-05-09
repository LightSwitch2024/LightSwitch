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


# sdk 초기화 : Lightswitch 클래스의 인스턴스를 생성하여 사용
# 해당 환경의 플래그 데이터 전부 가져오기 - 최초에 DB의 데이터를 모두 가져오고, 그런 다음 SSE 연결
lightswitch = Lightswitch(
    environment_key="826f68c4ec11422bb89e6511774bd62a"
)

print("특정 플래그 활성화 여부 확인: ", lightswitch.flags.is_feature_enabled("new_biomarker"))


# 특정 사용자의 플래그 데이터 가져오기
# 이메일로 사용자를 식별한다고 가정
identifier = "sumin@gmail.com"
# 사용자 특성 저장
#user = LSUser(user_id=123).set_property("name", "LEE").set_property("com", "Lunit")

user_id = 1
key = "memberId"
value = "2"

this_user = LSUser(user_id=user_id).set_property(key, value)
print(this_user)

# 이 환경의 전체 플래그 목록 가져오기
flags = lightswitch.flags.get_all_flags()
print("flags: ", flags)

# 특정 플래그 활성화 여부 확인
is_active = lightswitch.flags.is_feature_enabled("새로운 기능")

# 특정 플래그에 접근하여 기본값 가져오기 - 해당 플래그가 활성화 되었을 때 기본으로 적용될 값
new_flag_default_value = lightswitch.flags.get_feature_value_by_name("new_biomarker")

# 개별 플래그에 접근하기
admin_only_feature_flag = lightswitch.flags.get_flag_by_name("admin only data")
# print("확인하고 싶은 플래그 정보 : ", admin_only_feature_flag)

# test : 개별 플래그의 keyword 가져오기
# print("keywords for admin_only_data : ", admin_only_feature_flag.get_keywords())

# test : 개별 플래그의 context 가져오기
new_new_new_feature_flag = lightswitch.flags.get_flag_by_name("new_new_new_feature")
contexts = new_new_new_feature_flag.get_contexts()
# print("contexts for new_new_new_feature : ", contexts)

# 특정 플래그에 대해 유저에 할당된 값 가져오기
# 1. 키워드 할당 여부 판별
user_variation = admin_only_feature_flag.get_user_variation_by_keyword(this_user)
# print("user_variation for admin_only_feature: ", user_variation)
# print()
# 2. 그룹 분배 결과 확인
user_variation_by_percentile = new_new_new_feature_flag.get_user_variation_by_percentile(this_user)
# print("user_variation for new_new_new_feature: ", user_variation_by_percentile)
# print()

print("test 시작 ----------------------------------------------------------")
# get_flag test
this_user_value = lightswitch.get_flag("admin only data", this_user)
print("get_flag test(True) : ", this_user_value)
this_user_value2 = lightswitch.get_flag("new_feature", this_user)
print("get_flag test2 : ", this_user_value2)
print()
# get_boolean_test
this_user_bool_value = lightswitch.get_boolean_flag("admin only data", this_user)
print("get_boolean_test1 : ", this_user_bool_value)
this_user_bool_value2 = lightswitch.get_boolean_flag("new_feature", this_user)
# print("get_boolean_test2(int 플래그입니다) :  ", this_user_bool_value2)


