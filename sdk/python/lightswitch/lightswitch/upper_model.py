import math
import typing
import uuid

from annotated_types import Ge, Le, SupportsLt
from pydantic import UUID4, BaseModel, Field, model_validator # input data를 정해진 타입의 데이터로 변환하여 출력
from pydantic_collections import BaseCollectionModel
from typing_extensions import Annotated

from flag_engine.utils.exceptions import InvalidPercentageAllocation
from flag_engine.utils.hashing import get_hashed_percentage_for_object_ids

# 기능의 식별자, 이름, 타입 정보를 가짐
class FeatureModel(BaseModel):
    id: int
    name: str
    type: str

    def __eq__(self, other: object) -> bool:
        return isinstance(other, FeatureModel) and self.id == other.id

    def __hash__(self) -> int:
        return hash(self.id)

# 다수의 variation을 가지는 기능에서 각 variation의 value - 예)
class MultivariateFeatureOptionModel(BaseModel):
    value: typing.Any
    id: typing.Optional[int] = None

# 플래그의 variation과 percentage의 조합 데이터 - 예를 들어 True - 10%(10% 유저에 대해서만 신기능 테스트)
class MultivariateFeatureStateValueModel(BaseModel):
    multivariate_feature_option: MultivariateFeatureOptionModel # 플래그의 값
    percentage_allocation: Annotated[float, Ge(0), Le(100)] # 백분율
    id: typing.Optional[int] = None
    mv_fs_value_uuid: UUID4 = Field(default_factory=uuid.uuid4) # 식별자 부여


class FeatureSegmentModel(BaseModel):
    priority: typing.Optional[int] = None
 
# variation-percentage의 데이터(MultivariateFeatureStateValueModel) 묶음 - 플래그 당 하나 
class MultivariateFeatureStateValueList(
    BaseCollectionModel[MultivariateFeatureStateValueModel]  # type: ignore[misc,no-any-unimported]
):
    # 해당 플래그의 percentage 합이 100%가 넘지 않는지 유효성 검사
    @staticmethod
    def _ensure_correct_percentage_allocations(
        value: typing.List[MultivariateFeatureStateValueModel],
    ) -> typing.List[MultivariateFeatureStateValueModel]:
        if (
            sum(
                multivariate_feature_state.percentage_allocation
                for multivariate_feature_state in value
            )
            > 100
        ):
            raise InvalidPercentageAllocation(
                "Total percentage allocation for feature must be less or equal to 100 percent"
            )
        return value

    percentage_allocations_model_validator = model_validator(mode="after")(
        _ensure_correct_percentage_allocations
    )
    # MultivariateFeatureStateValueModel타입 데이터를 리스트에 추가하기 전에 비율의 합을 검사하고, 100를 넘지 않으면
    # 상위 클래스의 append메서드를 호출하여 해당 데이터를 리스트에 추가 
    def append(
        self,
        multivariate_feature_state_value: MultivariateFeatureStateValueModel,
    ) -> None:
        self._ensure_correct_percentage_allocations(
            [*self, multivariate_feature_state_value],
        )
        super().append(multivariate_feature_state_value)

# 기능 상태를 관리
class FeatureStateModel(BaseModel, validate_assignment=True):
    feature: FeatureModel # 해당 기능과 관련된 FeatureModel타입의 데이터 
    enabled: bool # 해당 기능의 활성화 여부
    django_id: typing.Optional[int] = None
    feature_segment: typing.Optional[FeatureSegmentModel] = None
    featurestate_uuid: UUID4 = Field(default_factory=uuid.uuid4) # 해당 기능 상태의 고유 아이디 
    feature_state_value: typing.Any = None # 해당 기능 상태의 값(기본값?)
    multivariate_feature_state_values: MultivariateFeatureStateValueList = Field(
        default_factory=MultivariateFeatureStateValueList # 해당 기능 상태에 대해 지정된 variation-percentage의 조합 리스트
    ) 
    # 기능 상태의 기본값 설정
    def set_value(self, value: typing.Any) -> None:
        self.feature_state_value = value
    # 
    def get_value(self, identity_id: typing.Union[None, int, str] = None) -> typing.Any:
        """
        Get the value of the feature state.

        :param identity_id: a unique identifier for the identity, can be either a
            numeric id or a string but must be unique for the identity.
        :return: the value of the feature state.
        """
        # 해당 기능에 대해 다변량테스트 조건이 설정되어 있는지(MultivariateFeatureStateValueList가 최소 하나의 요소라도 가지는지) 확인
        if identity_id and len(self.multivariate_feature_state_values) > 0:
            return self._get_multivariate_value(identity_id) # 해당 사용자에 대한 적절한 다변량 값을 반환 
        return self.feature_state_value # 그렇지 않다면 기본값을 반환

    def is_higher_segment_priority(self, other: "FeatureStateModel") -> bool:
        """
        Returns `True` if `self` is higher segment priority than `other`
        (i.e. has lower value for feature_segment.priority)

        NOTE:
            A segment will be considered higher priority only if:
            1. `other` does not have a feature segment(i.e: it is an environment feature state or it's a
            feature state with feature segment but from an old document that does not have `feature_segment.priority`)
            but `self` does.

            2. `other` have a feature segment with high priority

        """

        if other_feature_segment := other.feature_segment:
            if (
                other_feature_segment_priority := other_feature_segment.priority
            ) is not None:
                return (
                    getattr(
                        self.feature_segment,
                        "priority",
                        math.inf,
                    )
                    < other_feature_segment_priority
                )
        return False
    # 다변량 테스트에서 해당 사용자에게 할당할 값을 결정
    def _get_multivariate_value(
        self, identity_id: typing.Union[int, str]
    ) -> typing.Any:
        percentage_value = get_hashed_percentage_for_object_ids(
            [self.django_id or self.featurestate_uuid, identity_id]
        ) # 사용자에 따라 고유한 해시된 백분율 값을 반환 - 예) 15%
        # 동일한 identity_id에 대해서는 항상 동일한 해시된 백분율 값이 반환됨

        # Iterate over the mv options in order of id (so we get the same value each
        # time) to determine the correct value to return to the identity based on
        # the percentage allocations of the multivariate options. This gives us a
        # way to ensure that the same value is returned every time we use the same
        # percentage value.
        start_percentage = 0.0
        # variation과 percentage의 조합 데이터를 인자로 받아 정렬을 위한 키 반환 
        def _mv_fs_sort_key(mv_value: MultivariateFeatureStateValueModel) -> SupportsLt:
            return mv_value.id or mv_value.mv_fs_value_uuid

        for mv_value in sorted(
            self.multivariate_feature_state_values,
            key=_mv_fs_sort_key,
        ): # 정렬된 각 다변량 옵션에 대해 해당 옵션의 백분율 할당(예:0%~20%)과 시작 백분율(0%)을 기준으로 사용자의 백분율 값이 속하는 옵션을 찾음
            limit = mv_value.percentage_allocation + start_percentage
            if start_percentage <= percentage_value < limit: # 찾았다면 
                return mv_value.multivariate_feature_option.value # 해당 옵션의 값을 반환
          
            start_percentage = limit 
        # default to return the control value if no MV values found, although this
        # should never happen
        # 어떤 옵션의 백분율에도 속하지 않는 경우라면 해당 플래그의 기본값을 반환 
        return self.feature_state_value