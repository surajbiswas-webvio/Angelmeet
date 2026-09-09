"""Page Object Model for the AngelMeet Registration page.

The registration page is a public, unauthenticated page on the user application
(https://app.angelmeet.ai/register). This page object centralises all locators
for the registration form (Full name, Username, Work email, Password), the
Create account action, the password visibility toggle, the Sign in link, and
the theme toggle. It also exposes helpers to generate unique, disposable
registration data so that every test run uses fresh values and avoids
``username/email already exists`` errors.
"""

from __future__ import annotations

import re
import time

from playwright.sync_api import Page, expect

from .base_page import BasePage

# Fields and actions are located by stable element IDs / accessible roles
# rather than XPath. See the codebase convention in the other page objects.
_LOGO = "img[alt='AngelMeet']"
_NAME = "#name"
_USERNAME = "#username"
_EMAIL = "#email"
_PASSWORD = "#password"


def unique_test_data() -> dict:
    """Return a dict of unique, disposable registration values.

    A high-resolution timestamp suffix makes each value unique per call, so
    repeated registration attempts do not collide with existing usernames or
    emails on the live application.
    """
    suffix = str(int(time.time() * 1000))
    return {
        "name": f"Automation User {suffix}",
        "username": f"amuser{suffix}",
        "email": f"amuser{suffix}@example.com",
        "password": "StrongPass1!",
    }


class RegistrationPage(BasePage):
    """Encapsulates the registration form and its related controls."""

    def __init__(self, page: Page) -> None:
        """Store the Playwright page and initialise the concrete locators."""
        super().__init__(page)
        self.name_input = page.locator(_NAME)
        self.username_input = page.locator(_USERNAME)
        self.email_input = page.locator(_EMAIL)
        self.password_input = page.locator(_PASSWORD)
        self.create_account_button = page.get_by_role("button", name="Create account")
        self.show_password_button = page.get_by_role("button", name="Show password")
        self.hide_password_button = page.get_by_role("button", name="Hide password")
        self.theme_toggle = page.get_by_role("button", name="Toggle theme")
        self.sign_in_link = page.get_by_role("link", name="Sign in")

    # ------------------------------------------------------------------ #
    # Navigation / readiness
    # ------------------------------------------------------------------ #
    def open(self) -> None:
        """Navigate to the registration page, waiting for the DOM to be ready."""
        self.page.goto("/register", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        """Assert that the registration page has loaded with its core elements."""
        expect(self.page).to_have_title("AngelMeet")
        self.expect_logo_visible()
        self.expect_visible(self.page.get_by_role("heading", name="Create your account"))
        for field in [self.name_input, self.username_input, self.email_input, self.password_input]:
            self.expect_visible(field)

    def logo(self):
        """Return the AngelMeet brand logo locator (the visible variant).

        The header can render two logo images (a light and a dark variant), so
        the ``:visible`` filter keeps this locator unambiguous regardless of the
        active theme.
        """
        return self.page.locator(f"{_LOGO}:visible").first

    def expect_logo_visible(self) -> None:
        """Assert that the AngelMeet brand logo is visible."""
        self.expect_visible(self.logo())

    # ------------------------------------------------------------------ #
    # Form interaction
    # ------------------------------------------------------------------ #
    def fill_registration(self, name: str, username: str, email: str, password: str) -> None:
        """Fill all four registration fields with the given values."""
        self.name_input.fill(name)
        self.username_input.fill(username)
        self.email_input.fill(email)
        self.password_input.fill(password)

    def fill_valid_form(self, data: dict) -> None:
        """Fill the form using a data dict returned by :func:`unique_test_data`."""
        self.fill_registration(data["name"], data["username"], data["email"], data["password"])

    def submit(self) -> None:
        """Click the Create account button to submit the registration form."""
        self.create_account_button.click()

    def clear_form(self) -> None:
        """Empty all four registration fields."""
        for field in [self.name_input, self.username_input, self.email_input, self.password_input]:
            field.fill("")

    # ------------------------------------------------------------------ #
    # State assertions
    # ------------------------------------------------------------------ #
    def is_submit_enabled(self) -> bool:
        """Return whether the Create account button is currently enabled."""
        return self.create_account_button.is_enabled()

    def expect_submit_disabled(self) -> None:
        """Assert the Create account button is disabled."""
        expect(self.create_account_button).to_be_disabled()

    def expect_submit_enabled(self) -> None:
        """Assert the Create account button is enabled."""
        expect(self.create_account_button).to_be_enabled()

    def field_is_valid(self, locator) -> bool:
        """Return True when the field passes native HTML5 constraint validation."""
        return locator.evaluate("(el) => el.checkValidity()")

    def field_validation_message(self, locator) -> str:
        """Return the native browser validation message for a field, if any."""
        return locator.evaluate("(el) => el.validationMessage")

    # ------------------------------------------------------------------ #
    # Password visibility toggle
    # ------------------------------------------------------------------ #
    def password_is_masked(self) -> bool:
        """Return True when the password input is type=password (masked)."""
        return self.password_input.get_attribute("type") == "password"

    def reveal_password(self) -> None:
        """Click the eye icon to make the password visible."""
        self.show_password_button.click()

    def hide_password(self) -> None:
        """Click the eye icon to mask the password again."""
        self.hide_password_button.click()

    # ------------------------------------------------------------------ #
    # Theme toggle
    # ------------------------------------------------------------------ #
    def open_theme_menu(self) -> None:
        """Click the theme toggle to open the Light/Dark/System menu."""
        self.theme_toggle.click()

    def select_theme(self, theme: str) -> None:
        """Choose a theme from the opened theme menu."""
        self.page.get_by_role("menuitem", name=theme).click()

    # ------------------------------------------------------------------ #
    # Success / navigation assertions
    # ------------------------------------------------------------------ #
    def expect_verify_screen(self, email: str) -> None:
        """Assert that a successful registration reaches the email verification screen.

        After a valid submission the app navigates to ``/verify?email=...`` and
        renders a "Check your email" page showing the supplied address. The
        email is URL-encoded in the query string (``@`` becomes ``%40``), so we
        assert the heading and the human-readable text rather than the exact URL.
        """
        expect(self.page).to_have_url(re.compile(r"/verify\?email="))
        self.expect_visible(self.page.get_by_role("heading", name="Check your email"))
        self.expect_visible(self.page.get_by_text(f"We sent a verification link to {email}."))
