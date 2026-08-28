import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def _required(name: str) -> str:
    value = os.getenv(name, "")
    if not value or value.startswith("replace-with-"):
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


@dataclass(frozen=True)
class Settings:
    base_url: str = os.getenv("BASE_URL", "https://app.angelmeet.ai")
    admin_url: str = os.getenv("ADMIN_URL", "https://admin.angelmeet.ai")

    @property
    def email(self) -> str:
        return _required("E2E_EMAIL")

    @property
    def password(self) -> str:
        return _required("E2E_PASSWORD")

    @property
    def admin_email(self) -> str:
        return _required("ADMIN_EMAIL")

    @property
    def admin_password(self) -> str:
        return _required("ADMIN_PASSWORD")


settings = Settings()
