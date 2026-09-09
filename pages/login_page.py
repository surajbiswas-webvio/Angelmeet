"""Page Object Model for the user-application login page."""

import re

from playwright.sync_api import expect

from .base_page import BasePage


class LoginPage(BasePage):
    """Encapsulates the login page UI (email/password fields and sign-in action)."""

    def open(self) -> None:
        """Navigate to the login page, waiting for the DOM to be ready."""
        self.page.goto("/login", wait_until="domcontentloaded")

    def submit_credentials(self, email: str, password: str) -> None:
        """Fill in the email and password fields and click the Sign in button."""
        self.page.get_by_role("textbox", name="Email").fill(email)
        self.page.get_by_role("textbox", name="Password").fill(password)
        self.page.get_by_role("button", name="Sign in").click()

    def login(self, email: str, password: str) -> None:
        """Submit credentials and assert successful navigation to the home URL."""
        self.submit_credentials(email, password)
        expect(self.page).to_have_url(re.compile(r".*/home$"))

    def submit(self) -> None:
        """Click the Sign in button without filling any fields first."""
        self.page.get_by_role("button", name="Sign in").click()

    def expect_login_form(self) -> None:
        """Assert that the login form (email field) is visible."""
        self.expect_visible(self.page.get_by_role("textbox", name="Email"))

    def expect_error(self) -> None:
        """Assert that a login error message is displayed."""
        expect(self.page.get_by_text(re.compile(r"do not match|invalid|incorrect|unable", re.I))).to_be_visible()
