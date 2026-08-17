import os
from typing import Optional

from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"), override=False)

PLACEHOLDER_VALUES = {"replace-with-test-account-email", "replace-with-test-account-password"}


def get_env(name: str, default: Optional[str] = None) -> Optional[str]:
    return os.getenv(name, default)


def get_base_url() -> str:
    return get_env("BASE_URL", "https://meeting.webvio.in") or "https://meeting.webvio.in"


def get_email() -> Optional[str]:
    return get_env("E2E_EMAIL")


def get_password() -> Optional[str]:
    return get_env("E2E_PASSWORD")


def has_test_credentials() -> bool:
    email = (get_email() or "").strip()
    password = (get_password() or "").strip()
    if not email or not password:
        return False
    if email in PLACEHOLDER_VALUES or password in PLACEHOLDER_VALUES:
        return False
    return True
