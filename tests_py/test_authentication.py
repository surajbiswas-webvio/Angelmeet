import re

import pytest
from playwright.sync_api import expect

from config.env import settings
from pages_py.login_page import LoginPage


@pytest.mark.unauthenticated
@pytest.mark.smoke
def test_am001_signs_in_with_valid_account(page):
    login = LoginPage(page)
    login.open()
    login.login(settings.email, settings.password)
    expect(page.get_by_role("heading", name="Home")).to_be_visible()


@pytest.mark.unauthenticated
def test_am002_rejects_invalid_credentials(page):
    login = LoginPage(page)
    login.open()
    login.submit_credentials(settings.email, "invalid-password-for-negative-test")
    login.expect_error()
    expect(page).to_have_url(re.compile(r"/login$"))


@pytest.mark.unauthenticated
def test_am003_validates_empty_credentials(page):
    LoginPage(page).open()
    expect(page.get_by_role("button", name="Sign in")).to_be_disabled()


@pytest.mark.unauthenticated
def test_regression_malformed_login_input_is_rejected(page):
    login = LoginPage(page)
    login.open()
    page.get_by_role("textbox", name="Email").fill("malformed-email")
    expect(page.get_by_role("button", name="Sign in")).to_be_disabled()
