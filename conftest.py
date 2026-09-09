"""pytest fixtures for the AngelMeet Playwright test suite.

This module declares the shared browser fixtures, per-test page objects, and
the reusable authentication flow used to log in to both the user application
and the admin control plane. Empty (unauthenticated) browser contexts are
provided for tests marked with ``unauthenticated``.
"""

from pathlib import Path
from typing import Iterator

import pytest
from playwright.sync_api import Browser, Page

from config.env import settings
from pages import DashboardPage, MeetingsPage, NotetakerPage, ProfilePage, RegistrationPage

# Directory and file paths that cache the authenticated storage states between
# test runs/sessions so that login is performed only once per session.
AUTH_DIR = Path(__file__).parent / ".auth"
USER_STATE = AUTH_DIR / "user-python.json"
ADMIN_STATE = AUTH_DIR / "admin-python.json"


def _authenticate(browser: Browser, url: str, email: str, password: str, state: Path) -> None:
    """Log in to an application and persist the resulting storage state to disk.

    Opens a fresh browser context at the given login URL, fills the credentials,
    submits the sign-in form, waits for navigation to the home workspace, and
    saves ``storage_state`` (cookies + local storage) to the supplied path.
    """
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
    """Return the path to the authenticated user storage state (session-scoped)."""
    _authenticate(browser, settings.base_url, settings.email, settings.password, USER_STATE)
    return str(USER_STATE)


@pytest.fixture(scope="session")
def admin_storage_state(browser: Browser) -> str:
    """Return the path to the authenticated admin storage state (session-scoped)."""
    _authenticate(browser, settings.admin_url, settings.admin_email, settings.admin_password, ADMIN_STATE)
    return str(ADMIN_STATE)


@pytest.fixture
def page(request: pytest.FixtureRequest, browser: Browser) -> Iterator[Page]:
    """Provide a Page for the user application.

    Loads the authenticated storage state unless the test is marked
    ``unauthenticated``, in which case a clean, empty context is used.
    """
    unauthenticated = request.node.get_closest_marker("unauthenticated") is not None
    state = None if unauthenticated else request.getfixturevalue("user_storage_state")
    context = browser.new_context(base_url=settings.base_url, storage_state=state)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def admin_page(browser: Browser, admin_storage_state: str) -> Iterator[Page]:
    """Provide an authenticated admin Page for the admin control plane."""
    context = browser.new_context(base_url=settings.admin_url, storage_state=admin_storage_state)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def admin_page_empty(browser: Browser) -> Iterator[Page]:
    """Provide an unauthenticated (empty) admin Page, e.g. for login-page tests."""
    context = browser.new_context(base_url=settings.admin_url)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def dashboard(page: Page) -> DashboardPage:
    """Return a DashboardPage instance backed by the current user page."""
    return DashboardPage(page)


@pytest.fixture
def meetings(page: Page) -> MeetingsPage:
    """Return a MeetingsPage instance backed by the current user page."""
    return MeetingsPage(page)


@pytest.fixture
def notetaker(page: Page) -> NotetakerPage:
    """Return a NotetakerPage instance backed by the current user page."""
    return NotetakerPage(page)


@pytest.fixture
def profile(page: Page) -> ProfilePage:
    """Return a ProfilePage instance backed by the current user page."""
    return ProfilePage(page)


@pytest.fixture
def register(page: Page) -> RegistrationPage:
    """Return a RegistrationPage instance backed by the current user page.

    Registration tests are marked ``unauthenticated`` so the underlying page is
    created with an empty browser context (the registration page is public).
    """
    return RegistrationPage(page)
