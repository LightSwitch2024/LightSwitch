from __future__ import annotations

import typing
from dataclasses import dataclass, field

from lightswitch.lightswitch.exceptions import FeatureNotFoundError

# 데이터 모델 정의
@dataclass
class BaseFlag:
    enabled: bool
    value: typing.Union[bool, None]


@dataclass
class DefaultFlag(BaseFlag):
    is_default: bool = field(default=True) # 기본값 여부


@dataclass
class Flag(BaseFlag):
    feature_id: int
    feature_name: str
    is_default: bool = field(default=False) 

    # SSE로 받은 flag_data를 기반으로 인스턴스 생성
    # flag_data 포맷 논의 필요
    @classmethod
    def flag_from_api(
        cls,
        flag_data: typing.Mapping[str, typing.Any] # 딕셔너리 형식의 인자를 받음
    ) -> Flag:
        return Flag(
            enabled=flag_data["data"]["active"],
            value=flag_data["data"]["defaultValue"],
            feature_name=flag_data["data"]["title"],
            feature_id=flag_data["data"]["flagId"]
        )
    

@dataclass
class Flags(BaseFlag):
    flags: typing.Dict[str, Flag] = field(default_factory=dict) # "기능 이름" : "Flag객체" 형식으로 개별 기능을 저장
    
    @classmethod
    def flags_from_api(
        cls,
        flags_data: typing.Sequence[typing.Mapping[str, typing.Any]]
    ) -> Flags:
        flags = {
            flag_data["data"]["title"]: Flag.flag_from_api(flag_data)
            for flag_data in flags_data
        }
        # Flags 인스턴스를 반환
        return cls(
            flags=flags
        )    

    def get_all_flags(self) -> typing.List[Flag]:
        return list(self.flags.values()) # Flag 인스턴스의 리스트 반환

    def is_feature_enabled(self, feature_name: str) -> bool:
        return self.get_flag_by_name(feature_name).enabled

    def get_feature_value_by_name(self, feature_name: str) -> typing.Any:
        return self.get_flag_by_name(feature_name).value

    def get_flag_by_name(self, feature_name: str) -> typing.Union[DefaultFlag, Flag]:
        try:
            flag = self.flags[feature_name] # 플래그 이름을 키 값으로 하여 플래그 객체를 저장하므로 키 값으로 찾아옴
        except KeyError:
            raise FeatureNotFoundError(feature_name)
        return flag