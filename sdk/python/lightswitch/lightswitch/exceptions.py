from typing import Optional


class LSFlagNotFoundError(Exception):
    """Exception raised when a requested feature does not exist."""
    def __init__(self, feature_name: str):
        self.feature_name = feature_name
        self.message = f"{feature_name} 플래그가 존재하지 않습니다."
        super().__init__(self.message)


class LSServerError(Exception):
    """Exception raised when an error occurs while communicating with the server."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class LSTypeCastError(Exception):
    def __init__(self, flag_name: str, data_type: str):
        self.message = (
            f"{flag_name} 플래그를 {data_type} 타입으로 캐스팅하는데 실패했습니다."
            f"Flag '{flag_name}'의 데이터 타입이 {data_type}이 아닙니다."
        )
        super().__init__(self.message)

class StreamDataError(Exception):
    """Exception raised when event data fails to provide valid JSON."""
    def __init__(self, message="Invalid stream event data."):
        self.message = message
        super().__init__(self.message)


class InvalidJsonResponseError(Exception):
    """Exception raised when response data is not valid JSON."""

    def __init__(self, message="Invalid JSON response from API.", status_code: Optional[int] = None):
        if status_code is not None:
            super().__init__(f"{message} Response status code: {status_code}")
        else:
            super().__init__(message)

