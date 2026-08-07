from pathlib import Path

import allure
import pytest
from dotenv import load_dotenv

from pages.dashboard_page import DashboardPage
from pages.login_page import LoginPage
from pages.meetings_page import MeetingsPage
from pages.notetaker_page import NotetakerPage
from pages.profile_page import ProfilePage
from utils.env import get_base_url, get_email, get_password

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env", override=False)


@pytest.fixture(scope="session")
def base_url() -> str:
    return get_base_url()


@pytest.fixture
def authenticated_page(page, base_url):
    email = get_email()
    password = get_password()
    if not email or not password:
        pytest.skip("E2E_EMAIL and E2E_PASSWORD must be set to run browser tests")

    login_page = LoginPage(page, base_url)
    login_page.open()
    login_page.login(email, password)
    return page


@pytest.fixture
def dashboard(authenticated_page, base_url):
    return DashboardPage(authenticated_page, base_url)


@pytest.fixture
def meetings(authenticated_page, base_url):
    return MeetingsPage(authenticated_page, base_url)


@pytest.fixture
def notetaker(authenticated_page, base_url):
    return NotetakerPage(authenticated_page, base_url)


@pytest.fixture
def profile(authenticated_page, base_url):
    return ProfilePage(authenticated_page, base_url)


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        page = item.funcargs.get("page") or item.funcargs.get("authenticated_page")
        if page is not None:
            screenshot_dir = Path("reports/screenshots")
            screenshot_dir.mkdir(parents=True, exist_ok=True)
            screenshot_path = screenshot_dir / f"{item.nodeid.replace('/', '__').replace(':', '_')}.png"
            page.screenshot(path=str(screenshot_path), full_page=True)
            allure.attach.file(str(screenshot_path), name="screenshot", attachment_type=allure.attachment_type.PNG)
            try:
                allure.attach(page.content(), name="page_source", attachment_type=allure.attachment_type.HTML)
            except Exception:  # pragma: no cover - best effort capture
                pass

    return report
