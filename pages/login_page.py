import re

from playwright.sync_api import expect

from .base_page import BasePage


class LoginPage(BasePage):
    def open(self) -> None:
        self.page.goto("/login", wait_until="domcontentloaded")

    def submit_credentials(self, email: str, password: str) -> None:
        self.page.get_by_role("textbox", name="Email").fill(email)
        self.page.get_by_role("textbox", name="Password").fill(password)
        self.page.get_by_role("button", name="Sign in").click()

    def login(self, email: str, password: str) -> None:
        self.submit_credentials(email, password)
        expect(self.page).to_have_url(re.compile(r".*/home$"))

    def submit(self) -> None:
        self.page.get_by_role("button", name="Sign in").click()

    def expect_login_form(self) -> None:
        self.expect_visible(self.page.get_by_role("textbox", name="Email"))

    def expect_error(self) -> None:
        expect(self.page.get_by_text(re.compile(r"do not match|invalid|incorrect|unable", re.I))).to_be_visible()
