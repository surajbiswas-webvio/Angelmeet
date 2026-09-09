"""Authentication tests: sign-in flows for the user application.

Covers successful login, rejection of invalid / malformed credentials, and
validation of empty credentials. These tests run without an authenticated
storage state (marked ``unauthenticated``).
"""

import re

import pytest
from playwright.sync_api import expect

from config.env import settings
from pages.login_page import LoginPage


@pytest.mark.unauthenticated
@pytest.mark.smoke
def test_am001_signs_in_with_valid_account(page):
    # Test Scenario: A valid test account is able to sign in and reach the dashboard.
    login = LoginPage(page)
    login.open()
    login.login(settings.email, settings.password)
    expect(page.get_by_role("heading", name="Home")).to_be_visible()


@pytest.mark.unauthenticated
@pytest.mark.smoke
def test_am002_rejects_invalid_credentials(page):
    # Test Scenario: Submitting an incorrect password is rejected and the user stays on login.
    login = LoginPage(page)
    login.open()
    login.submit_credentials(settings.email, "invalid-password-for-negative-test")
    login.expect_error()
    expect(page).to_have_url(re.compile(r"/login$"))


@pytest.mark.unauthenticated
@pytest.mark.smoke
def test_am003_validates_empty_credentials(page):
    # Test Scenario: The Sign in button is disabled while the form is empty.
    LoginPage(page).open()
    expect(page.get_by_role("button", name="Sign in")).to_be_disabled()


@pytest.mark.unauthenticated
def test_regression_malformed_login_input_is_rejected(page):
    # Test Scenario: A malformed email keeps the Sign in button disabled (no submit).
    login = LoginPage(page)
    login.open()
    page.get_by_role("textbox", name="Email").fill("malformed-email")
    expect(page.get_by_role("button", name="Sign in")).to_be_disabled()
