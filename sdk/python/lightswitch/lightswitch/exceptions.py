from typing import Optional


class FeatureNotFoundError(Exception):
    """Exception raised when a requested feature does not exist."""
    def __init__(self, feature_name: str, message: str = "Feature does not exist"):
        self.feature_name = feature_name
        self.message = f"{message}: {feature_name}"
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



