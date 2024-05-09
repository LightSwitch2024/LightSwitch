from __future__ import annotations

import json
import typing
from dataclasses import dataclass, field

from .exceptions import FeatureNotFoundError
from .utils import get_hashed_percentage_for_object_ids

# 데이터 모델 정의
@dataclass
class LSUser:
    user_id: int
    property: typing.Dict[str, str] = field(default_factory=dict)

    def set_property(self, key: str, value: str) -> 'LSUser':
        self.property[key] = value
        return self


@dataclass
class Property:
    property_name: str  # "관리자 아이디"(식별자)
    data: str  # 아이디 값 - ex) "3"


@dataclass
class Keyword:
    property_list: typing.List[Property]
    description: str
    value: str


@dataclass
class Context:  # variation과 동일
    value: str
    portion: int
    description: str


@dataclass
class Flag:
    flag_id: int
    title: str
    description: str
    type: str
    keywords: typing.List[Keyword]  # 타겟 테스팅 조건 데이터
    default_value: str
    default_value_portion: int
    default_value_description: str
    variations: typing.List[Context]  # 그룹 분배 테스트 조건 데이터
    maintainer_id: int
    created_at: str
    updated_at: str
    delete_at: str
    active: bool

    def get_attribute_value(self, attribute: str):
        try:
            return getattr(self, attribute)
        except AttributeError as exc:
            raise FeatureNotFoundError(f"Attribute '{attribute}' 은 해당 플래그에 존재하지 않습니다.") from exc

    # 플래그의 키워드를 확인, 해당 유저가 타겟팅되어 있으면 그에 맞는 값을 반환, 아니면 플래그 기본값
    def get_user_variation_by_keyword(self, user: LSUser) -> typing.Any:
        flag_keywords = self.keywords
        for keyword in flag_keywords:
            for prop in keyword.get('properties', []):
                if prop['property'] in user.property and prop['data'] in user.property[prop['property']]:
                    value = self.convert_value(keyword.get('value'))
                    return value
        return False

    # 플래그의 context를 확인, 유저의 백분율 값을 계산하여 어디에 속하는지 확인
    def get_user_variation_by_percentile(self, user: LSUser) -> str:
        # 유저의 백분율값을 계산(유저 식별자와 플래그 식별자 함께 사용 : 플래그마다 다른 백분율값을 갖게 하기 위함)
        user_percentile=get_hashed_percentage_for_object_ids([f"{user.user_id}", "self.flag_id"])

        start_percentage = 0  # 시작 percentile
        for context in sorted(self.variations, key=lambda context: context['portion']):
            limit = start_percentage + context['portion']
            if start_percentage <= user_percentile < limit:
                value = self.convert_value(context['value'])
                return value

            start_percentage = limit

        return self.default_value

    def convert_value(self, value: str) -> typing.Any:  # 형변환 이후에 반환
        """
        value를 flag 타입에 따라 적절한 데이터 타입으로 변환하여 반환합니다.
        """
        if self.type == "BOOLEAN":
            return bool(value)
        if self.type == "INTEGER":
            return int(value)
        if self.type == "JSON":
            try:
                return json.loads(value)
            except json.JSONDecodeError:  # 디코딩 에러 발생 시에는 그대로 반환
                return value
        if self.type == "STRING":
            return str(value)
        return value

    # SSE flag_data를 기반으로 인스턴스 생성
    @classmethod
    def flag_from_api(
            cls,
            flag_data: typing.Mapping[str, typing.Any]  # 딕셔너리 형식의 인자를 받음
    ) -> Flag:
        return Flag(
            flag_id=flag_data["flagId"],
            title=flag_data["title"],
            description=flag_data["description"],
            type=flag_data["type"],
            keywords=flag_data.get("keywords", []),
            default_value=flag_data["defaultValue"],
            default_value_portion=flag_data["defaultPortion"],
            default_value_description=flag_data["defaultDescription"],
            variations=flag_data.get("variations", []),
            maintainer_id=flag_data["maintainerId"],
            created_at=flag_data["createdAt"],
            updated_at=flag_data["updatedAt"],
            delete_at=flag_data["deleteAt"],
            active=flag_data["active"],
        )

    # 해당 플래그의 keyword 가져오기
    def get_keywords(self) -> typing.List[Keyword]:
        return self.keywords

    # 해당 플래그의 context 가져오기
    def get_contexts(self) -> typing.List[Context]:
        return self.variations


@dataclass
class Flags:
    flags: typing.Dict[str, Flag] = field(default_factory=dict)  # "기능 이름" : "Flag객체" 형식으로 개별 기능을 저장

    @classmethod
    def flags_from_api(
            cls,
            flags_data: typing.Sequence[typing.Mapping[str, typing.Any]]
    ) -> Flags:
        flags = {
            flag_data["title"]: Flag.flag_from_api(flag_data)
            for flag_data in flags_data
        }
        # Flags 인스턴스를 반환
        return cls(
            flags=flags
        )

    def get_all_flags(self) -> typing.List[Flag]:
        return list(self.flags.values())  # Flag 인스턴스의 리스트 반환

    def is_feature_enabled(self, feature_name: str) -> bool:  # 플래그 활성화 여부 리턴
        return self.get_flag_by_name(feature_name).active

    def get_feature_value_by_name(self, feature_name: str) -> typing.Any:  # 기본값 리턴
        return self.get_flag_by_name(feature_name).default_value

    def get_flag_by_name(self, feature_name: str) -> Flag:
        try:
            flag = self.flags[feature_name]
        except KeyError as exc:
            raise FeatureNotFoundError(feature_name) from exc
        return flag

    # event 타입에 따라 수행할 메서드
    def add_flag(self, new_flag: Flag):
        self.flags[new_flag.title] = new_flag
        print('flag created.')

    def update_flag_value(self, flag_name: str, new_value: typing.Any):
        if flag_name in self.flags:
            self.flags[flag_name].default_value = new_value
            print('flag updated.')
        else:
            raise FeatureNotFoundError(flag_name)

    def delete_flag_by_name(self, flag_name: str):
        if flag_name in self.flags:
            del self.flags[flag_name]
            print('flag deleted.')
        else:
            raise FeatureNotFoundError(flag_name)

    def toggle_flag_activation(self, flag_name: str):
        if flag_name in self.flags:
            self.flags[flag_name].active = not self.flags[flag_name].active
            print("flag toggled.")
        else:
            raise FeatureNotFoundError(flag_name)
