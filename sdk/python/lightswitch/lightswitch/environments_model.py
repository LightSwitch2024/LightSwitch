import typing
from datetime import datetime

from pydantic import BaseModel, Field

from flag_engine.environments.integrations.models import IntegrationModel
from flag_engine.features.models import FeatureStateModel
from flag_engine.identities.models import IdentityModel
from flag_engine.projects.models import ProjectModel
from flag_engine.utils.datetime import utcnow_with_tz

# API 키 모델 - 한 환경 당 하나씩 
class EnvironmentAPIKeyModel(BaseModel):
    id: int
    key: str # API 키 문자열
    created_at: datetime 
    name: str
    client_api_key: str # 클라이언트에서 사용하는 API 키
    expires_at: typing.Optional[datetime] = None 
    active: bool = True

    @property
    def is_valid(self) -> bool:
        return self.active and (
            not self.expires_at or self.expires_at > utcnow_with_tz()
        )

# 웹훅 설정을 위한 모델
class WebhookModel(BaseModel):
    url: str # 웹훅의 url
    secret: str # 웹훅의 비밀키

# 
class EnvironmentModel(BaseModel):
    id: int
    api_key: str # 해당 환경의 API 키 
    project: ProjectModel # 환경이 속한 프로젝트
    feature_states: typing.List[FeatureStateModel] = Field(default_factory=list)
    identity_overrides: typing.List[IdentityModel] = Field(default_factory=list)

    name: typing.Optional[str] = None 
    allow_client_traits: bool = True
    updated_at: datetime = Field(default_factory=utcnow_with_tz)
    hide_sensitive_data: bool = False
    hide_disabled_flags: typing.Optional[bool] = None
    use_identity_composite_key_for_hashing: bool = False

    amplitude_config: typing.Optional[IntegrationModel] = None
    dynatrace_config: typing.Optional[IntegrationModel] = None
    heap_config: typing.Optional[IntegrationModel] = None
    mixpanel_config: typing.Optional[IntegrationModel] = None
    rudderstack_config: typing.Optional[IntegrationModel] = None
    segment_config: typing.Optional[IntegrationModel] = None

    webhook_config: typing.Optional[WebhookModel] = None

    _INTEGRATION_ATTRS = [
        "amplitude_config",
        "heap_config",
        "mixpanel_config",
        "rudderstack_config",
        "segment_config",
    ]

    @property
    def integrations_data(self) -> typing.Dict[str, typing.Dict[str, str]]:
        """
        Return a dictionary representation of all integration config objects.

            e.g.
            {
                "mixpanel_config": {"base_url": None, "api_key": "some-key"},
                "segment_config": {
                    "base_url": "https://api.segment.com",
                    "api_key": "some-key",
                }
            }
        """

        integrations_data = {}
        for integration_attr in self._INTEGRATION_ATTRS:
            integration_config: typing.Optional[IntegrationModel]
            if integration_config := getattr(self, integration_attr, None):
                integrations_data[integration_attr] = {
                    "base_url": integration_config.base_url,
                    "api_key": integration_config.api_key,
                    "entity_selector": integration_config.entity_selector,
                }
        return integrations_data

    def get_hide_disabled_flags(self) -> bool:
        if self.hide_disabled_flags is not None:
            return self.hide_disabled_flags
        return self.project.hide_disabled_flags