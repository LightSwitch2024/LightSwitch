from __future__ import annotations

import json
import typing
from dataclasses import dataclass, field

from exceptions import LSFlagNotFoundError
from utils import get_hashed_percentage_for_object_ids


# 데이터 모델 정의
@dataclass
class LSUser:
    user_id: str
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
    description: str
    value: str


@dataclass
class Context:
    value: str
    portion: int
    description: str


@dataclass
class Flag:
    flag_id: int
    title: str
    description: str
    type: str
    keywords: typing.List[Keyword]
    default_value: str
    default_value_portion: int
    default_value_description: str
    variations: typing.List[Context]
    maintainer_id: int
    created_at: str
    updated_at: str
    delete_at: str
    active: bool

    def get_attribute_value(self, attribute: str):
        try:
            return getattr(self, attribute)
        except AttributeError as exc:
            raise AttributeError(f"Attribute '{attribute}' 은(는) 해당 플래그에 존재하지 않습니다.") from exc

    def get_user_variation_by_keyword(self, user: LSUser) -> typing.Any:
        flag_keywords = self.keywords
        if len(flag_keywords) == 0:
            return "not targeted"
        
        for keyword in flag_keywords:
            is_targeted = True
            for prop in keyword.get('properties', []):
                user_has_the_key = prop['property'] in user.property
                if user_has_the_key and prop['data'] == user.property[prop['property']]:
                    continue
                else:
                    is_targeted = False
                    break

            if is_targeted:
                value = self.convert_value(keyword.get('value'))
                return value

    def get_user_variation_by_percentile(self, user: LSUser) -> str:
        user_percentile = get_hashed_percentage_for_object_ids([f"{user.user_id}", "self.flag_id"])
        print("user percentile : ", user_percentile)
        default_portion = self.default_value_portion
        start_percentage = 0  # 시작 percentile
        for context in self.variations:
            portion = context.get('portion', default_portion)
            limit = start_percentage + portion
            if start_percentage <= user_percentile < limit:
                value = self.convert_value(context['value'])
                return value

            start_percentage = limit

        return self.convert_value(self.default_value)

    def convert_value(self, value: str) -> typing.Any:
        """
        value를 flag 타입에 따라 적절한 데이터 타입으로 변환하여 반환합니다.
        """
        if self.type == "BOOLEAN":
            return value.upper() == "TRUE"
        if self.type == "INTEGER":
            return int(value)
        if self.type == "JSON":
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        if self.type == "STRING":
            return self
        return value

    @classmethod
    def flag_from_api(
            cls,
            flag_data: typing.Mapping[str, typing.Any]
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

    def get_keywords(self) -> typing.List[Keyword]:
        return self.keywords

    def get_contexts(self) -> typing.List[Context]:
        return self.variations


@dataclass
class Flags:
    flags: typing.Dict[str, Flag] = field(default_factory=dict)

    @classmethod
    def flags_from_api(
            cls,
            flags_data: typing.Sequence[typing.Mapping[str, typing.Any]]
    ) -> Flags:
        flags = {
            flag_data["title"]: Flag.flag_from_api(flag_data)
            for flag_data in flags_data
        }
        return cls(
            flags=flags
        )

    def get_all_flags(self) -> typing.List[Flag]:
        return list(self.flags.values())

    def is_feature_enabled(self, feature_name: str) -> bool:
        return self.get_flag_by_name(feature_name).active

    def get_feature_value_by_name(self, feature_name: str) -> typing.Any:
        return self.get_flag_by_name(feature_name).default_value

    def get_flag_by_name(self, feature_name: str) -> Flag:
        try:
            flag = self.flags[feature_name]
        except KeyError as exc:
            raise LSFlagNotFoundError(feature_name) from exc
        return flag

    def add_flag(self, new_flag: Flag):
        self.flags[new_flag.title] = new_flag

    def update_flag_value(self, flag_name: str, new_value: typing.Any):
        try:
            self.flags[flag_name].default_value = new_value
        except KeyError as exc:
            raise LSFlagNotFoundError(flag_name) from exc

    def delete_flag_by_name(self, flag_name: str):
        try:
            del self.flags[flag_name]
        except KeyError as exc:
            raise LSFlagNotFoundError(flag_name) from exc

    def toggle_flag_activation(self, new_flag: typing.Dict[str, typing.Any]):
        flag_title = new_flag["title"]
        flag_is_active = new_flag["active"]
        try:
            self.flags[flag_title].active = flag_is_active
        except KeyError as exc:
            raise LSFlagNotFoundError(flag_title) from exc
