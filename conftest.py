from pathlib import Path
from typing import Iterator

import pytest
from playwright.sync_api import Browser, Page

from config.env import settings
from pages_py import DashboardPage, MeetingsPage, NotetakerPage, ProfilePage

AUTH_DIR = Path(__file__).parent / ".auth"
USER_STATE = AUTH_DIR / "user-python.json"
ADMIN_STATE = AUTH_DIR / "admin-python.json"


def _authenticate(browser: Browser, url: str, email: str, password: str, state: Path) -> None:
    AUTH_DIR.mkdir(exist_ok=True)
    context = browser.new_context(base_url=url)
    page = context.new_page()
    page.goto("/login", wait_until="domcontentloaded")
    page.locator("#email").fill(email)
    page.locator("#password").fill(password)
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_url("**/home**")
    context.storage_state(path=str(state))
    context.close()


@pytest.fixture(scope="session")
def user_storage_state(browser: Browser) -> str:
    _authenticate(browser, settings.base_url, settings.email, settings.password, USER_STATE)
    return str(USER_STATE)


@pytest.fixture(scope="session")
def admin_storage_state(browser: Browser) -> str:
    _authenticate(browser, settings.admin_url, settings.admin_email, settings.admin_password, ADMIN_STATE)
    return str(ADMIN_STATE)


@pytest.fixture
def page(request: pytest.FixtureRequest, browser: Browser) -> Iterator[Page]:
    unauthenticated = request.node.get_closest_marker("unauthenticated") is not None
    state = None if unauthenticated else request.getfixturevalue("user_storage_state")
    context = browser.new_context(base_url=settings.base_url, storage_state=state)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def admin_page(browser: Browser, admin_storage_state: str) -> Iterator[Page]:
    context = browser.new_context(base_url=settings.admin_url, storage_state=admin_storage_state)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def admin_page_empty(browser: Browser) -> Iterator[Page]:
    context = browser.new_context(base_url=settings.admin_url)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def dashboard(page: Page) -> DashboardPage:
    return DashboardPage(page)


@pytest.fixture
def meetings(page: Page) -> MeetingsPage:
    return MeetingsPage(page)


@pytest.fixture
def notetaker(page: Page) -> NotetakerPage:
    return NotetakerPage(page)


@pytest.fixture
def profile(page: Page) -> ProfilePage:
    return ProfilePage(page)
