"""Application configuration loader.

Centralises access to environment variables used across the test suite
(user application, admin control plane, and credentials). Values are read
from a ``.env`` file (via python-dotenv) or the process environment.
"""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

# Load variables from the project's .env file into the environment (if present).
load_dotenv()


def _required(name: str) -> str:
    """Return a required environment variable, raising if it is missing.

    A variable is considered "missing" when it is empty or still left at the
    placeholder ``replace-with-...`` value used in ``.env.example``.
    """
    value = os.getenv(name, "")
    if not value or value.startswith("replace-with-"):
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


@dataclass(frozen=True)
class Settings:
    """Immutable snapshot of the application settings used by tests and fixtures."""

    base_url: str = os.getenv("BASE_URL", "https://app.angelmeet.ai")
    admin_url: str = os.getenv("ADMIN_URL", "https://admin.angelmeet.ai")

    @property
    def email(self) -> str:
        """Test account email for the user application."""
        return _required("E2E_EMAIL")

    @property
    def password(self) -> str:
        """Test account password for the user application."""
        return _required("E2E_PASSWORD")

    @property
    def admin_email(self) -> str:
        """Test account email for the admin control plane."""
        return _required("ADMIN_EMAIL")

    @property
    def admin_password(self) -> str:
        """Test account password for the admin control plane."""
        return _required("ADMIN_PASSWORD")


# Module-level singleton consumed by fixtures and tests.
settings = Settings()
