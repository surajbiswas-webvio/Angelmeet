import os
from typing import Optional

from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"), override=False)


def get_env(name: str, default: Optional[str] = None) -> Optional[str]:
    return os.getenv(name, default)


def get_base_url() -> str:
    return get_env("BASE_URL", "https://meeting.webvio.in") or "https://meeting.webvio.in"


def get_email() -> Optional[str]:
    return get_env("E2E_EMAIL")


def get_password() -> Optional[str]:
    return get_env("E2E_PASSWORD")
