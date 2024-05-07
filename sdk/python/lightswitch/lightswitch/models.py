from __future__ import annotations

import typing
from dataclasses import dataclass, field

from lightswitch.lightswitch.exceptions import FeatureNotFoundError


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
    property_name: str
    data: str


@dataclass
class Keyword:
    property_list: typing.List[Property]
    value: str


@dataclass
class Context:
    order: int
    value: str
    portion: int
    description: str


@dataclass
class Flag:
    flag_id: int
    title: str
    description: str
    type: str
    keywords: typing.List[typing.Dict[str, typing.Any]]  # 타겟 테스팅 조건 데이터
    default_value: str
    default_value_portion: int
    default_value_description: str
    variations: typing.List[typing.Dict[str, typing.Any]]  # 그룹 분배 테스트 조건 데이터
    maintainer_id: int
    created_at: str
    updated_at: str
    delete_at: str
    active: bool

    def get_attribute_value(self, attribute):
        try:
            return getattr(self, attribute)
        except AttributeError:
            raise FeatureNotFoundError(f"Attribute '{attribute}' 은 해당 플래그에 존재하지 않습니다.")

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
            flag = self.flags[feature_name]  # 플래그 이름을 키 값으로 하여 플래그 객체를 저장하므로 키 값으로 찾아옴
        except KeyError:
            raise FeatureNotFoundError(feature_name)
        return flag

    # event 타입에 따라 수행할 메서드
    def add_flag(self, new_flag: Flag):
        self.flags[new_flag.title] = new_flag

    def update_flag_value(self, flag_name: str, new_value: typing.Any):
        if flag_name in self.flags:
            self.flags[flag_name].default_value = new_value
        else:
            raise FeatureNotFoundError(flag_name)

    def delete_flag_by_name(self, flag_name: str):
        if flag_name in self.flags:
            del self.flags[flag_name]
        else:
            raise FeatureNotFoundError(flag_name)

    def toggle_flag_activation(self, flag_name: str):
        if flag_name in self.flags:
            self.flags[flag_name].active = not self.flags[flag_name].active
            print("스위치 토글")
        else:
            raise FeatureNotFoundError(flag_name)
