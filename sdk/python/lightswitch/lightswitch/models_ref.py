
from __future__ import annotations

import typing
from dataclasses import dataclass, field

from flag_engine.features.models import FeatureStateModel

from flagsmith.analytics import AnalyticsProcessor
from flagsmith.exceptions import FlagsmithClientError


@dataclass
class BaseFlag:
    enabled: bool # 활성화 상태
    value: typing.Union[str, int, float, bool, None] # 값(variation) - 문자열, 정수, 숫자, boolean 등


@dataclass
class DefaultFlag(BaseFlag):
    is_default: bool = field(default=True) # 기본 설정을 가리키는 플래그인지 여부, 기본값이 True


@dataclass
class Flag(BaseFlag):
    feature_id: int # 기능의 식별자
    feature_name: str # 기능의 이름
    is_default: bool = field(default=False) # 기본값이 False

    # Flag 클래스의 인스턴스 생성
    # FeatureStateModel 인스턴스를 인자로 받아 해당 모델의 정보를 기반으로 Flag 인스턴스 생성
    @classmethod
    def from_feature_state_model(
        cls, # 메서드가 호출된 클래스를 참조 - Flag
        feature_state_model: FeatureStateModel, # 특정 기능의 상태 정보 - 기능 활성화 여부, 이름, id
        identity_id: typing.Optional[typing.Union[str, int]] = None, # 사용자 또는 세션 식별자
    ) -> Flag:
        return Flag(
            enabled=feature_state_model.enabled,
            value=feature_state_model.get_value(identity_id=identity_id), # 사용자 식별자는 선택적으로 제공, 없으면? 
            feature_name=feature_state_model.feature.name,
            feature_id=feature_state_model.feature.id,
        )

    # 외부 API로부터 받은 플래그 데이터(flag_data)를 기반으로 Flag 인스턴스 생성
    @classmethod
    def from_api_flag(
        cls,
        flag_data: typing.Mapping[str, typing.Any] # 딕셔너리 타입의 플래그 데이터
    ) -> Flag:
        return Flag(
            enabled=flag_data["enabled"], # 
            value=flag_data["feature_state_value"], 
            feature_name=flag_data["feature"]["name"],
            feature_id=flag_data["feature"]["id"],
        )


@dataclass
class Flags:
    flags: typing.Dict[str, Flag] = field(default_factory=dict) # "기능 이름" : "Flag객체" 형식으로 개별 기능을 저장 
    default_flag_handler: typing.Optional[typing.Callable[[str], DefaultFlag]] = None
    _analytics_processor: typing.Optional[AnalyticsProcessor] = None

    @classmethod
    def from_feature_state_models(
        cls,
        feature_states: typing.Sequence[FeatureStateModel], # 객체 시퀀스, 각 Flag 객체를 하나의 속성값으로 가지는 Flags 인스턴스가 생성됨
        analytics_processor: typing.Optional[AnalyticsProcessor],
        default_flag_handler: typing.Optional[typing.Callable[[str], DefaultFlag]],
        identity_id: typing.Optional[typing.Union[str, int]] = None,
    ) -> Flags:
        flags = {
            feature_state.feature.name: Flag.from_feature_state_model(
                feature_state, identity_id=identity_id
            )
            for feature_state in feature_states
        } # 입력받은 플래그 시퀀스의 데이터를 flags라는 이름의 속성값으로 가지는 Flags 인스턴스를 생성

        return cls(
            flags=flags,
            default_flag_handler=default_flag_handler,
            _analytics_processor=analytics_processor,
        )

    # API로부터 받은 플래그 시퀀스를 가지고 Flags 인스턴스 생성
    @classmethod
    def from_api_flags(
        cls,
        api_flags: typing.Sequence[typing.Mapping[str, typing.Any]],
        analytics_processor: typing.Optional[AnalyticsProcessor],
        default_flag_handler: typing.Optional[typing.Callable[[str], DefaultFlag]],
    ) -> Flags:
        flags = {
            flag_data["feature"]["name"]: Flag.from_api_flag(flag_data)
            for flag_data in api_flags
        }

        return cls(
            flags=flags,
            default_flag_handler=default_flag_handler,
            _analytics_processor=analytics_processor,
        )

    # Flags 인스턴스가 담고 있는 모든 Flag 객체의 리스트를 반환
    def all_flags(self) -> typing.List[Flag]:
        """
        Get a list of all Flag objects.

        :return: list of Flag objects.
        """
        return list(self.flags.values())

    # feature_name에 해당하는 플래그의 활성화 상태를 반환, 해당 기능이 존재하지 않는 경우 에러 반환
    def is_feature_enabled(self, feature_name: str) -> bool:
        """
        Check whether a given feature is enabled.

        :param feature_name: the name of the feature to check if enabled.
        :return: Boolean representing the enabled state of a given feature.
        :raises FlagsmithClientError: if feature doesn't exist
        """
        return self.get_flag(feature_name).enabled
    # feature_name에 해당하는 플래그의 값을 반환
    def get_feature_value(self, feature_name: str) -> typing.Any:
        """
        Get the value of a particular feature.

        :param feature_name: the name of the feature to retrieve the value of.
        :return: the value of the given feature.
        :raises FlagsmithClientError: if feature doesn't exist
        """
        return self.get_flag(feature_name).value
    # feature_name에 해당하는 Flag 객체 반환
    def get_flag(self, feature_name: str) -> typing.Union[DefaultFlag, Flag]:
        """
        Get a specific flag given the feature name.

        :param feature_name: the name of the feature to retrieve the flag for.
        :return: DefaultFlag | Flag object.
        :raises FlagsmithClientError: if feature doesn't exist
        """
        try:
            flag = self.flags[feature_name]
        except KeyError:
            if self.default_flag_handler:
                return self.default_flag_handler(feature_name)
            raise FlagsmithClientError("Feature does not exist: %s" % feature_name)

        if self._analytics_processor and hasattr(flag, "feature_name"):
            self._analytics_processor.track_feature(flag.feature_name)

        return flag


@dataclass
class Segment:
    id: int
    name: str