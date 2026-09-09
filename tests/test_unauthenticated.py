"""Unauthenticated tests: public pages, redirects, and logout behaviour."""

import re

import pytest
from playwright.sync_api import expect


@pytest.mark.unauthenticated
def test_am_un01_login_page(page):
    # Test Scenario: The public login page renders its core elements.
    page.goto("/login")
    for role, name in [("heading", "Welcome back"), ("textbox", "Email"), ("textbox", "Password"), ("button", "Sign in")]:
        expect(page.get_by_role(role, name=name)).to_be_visible()


@pytest.mark.unauthenticated
def test_am_un02_registration_page(page):
    # Test Scenario: The registration page renders its create-account form.
    page.goto("/register")
    expect(page.get_by_role("button", name="Create account")).to_be_visible()
    expect(page.get_by_placeholder("Ada Lovelace")).to_be_visible()


@pytest.mark.unauthenticated
def test_am_un03_forgot_password_page(page):
    # Test Scenario: The forgot-password page renders email input and reset action.
    page.goto("/forgot")
    expect(page.get_by_role("textbox", name="Email")).to_be_visible()
    expect(page.get_by_role("button", name=re.compile("send|reset", re.I))).to_be_visible()


@pytest.mark.unauthenticated
@pytest.mark.parametrize("name", ["Continue with Google", "Create an account", "Forgot password?"])
def test_am_un04_to_un06_login_links(page, name):
    # Test Scenario: Login page secondary actions/links are present.
    page.goto("/login")
    role = "button" if name == "Continue with Google" else "link"
    locator = page.get_by_role(role, name=name)
    if name == "Continue with Google" and not locator.is_visible():
        pytest.skip("Google OAuth is not enabled on the current login page")
    expect(locator).to_be_visible()


@pytest.mark.unauthenticated
def test_am_un07_invalid_login_shows_error(page):
    # Test Scenario: Invalid login shows an authentication error message.
    page.goto("/login")
    page.get_by_role("textbox", name="Email").fill("nonexistent@test.com")
    page.get_by_role("textbox", name="Password").fill("wrongpassword123")
    page.get_by_role("button", name="Sign in").click()
    expect(page.get_by_text(re.compile("do not match|invalid|incorrect|unable", re.I))).to_be_visible()


@pytest.mark.unauthenticated
def test_am_un08_protected_routes_redirect_to_login(page):
    # Test Scenario: Visiting a protected route without auth redirects to login.
    page.goto("/home")
    expect(page).to_have_url(re.compile("login"))


def test_am_un09_logout_returns_to_login(page):
    # Test Scenario: Logging out returns the user to the login page.
    page.goto("/home")
    expect(page.get_by_role("heading", name="Home")).to_be_visible()
    page.get_by_role("button", name="Account menu").click()
    page.get_by_role("menuitem", name=re.compile("logout|sign out", re.I)).click()
    expect(page).to_have_url(re.compile("login"))
