from playwright.sync_api import expect

from .base_page import BasePage


class ProfilePage(BasePage):
    def open_menu(self) -> None:
        self.page.get_by_role("button", name="Account menu").click()

    def open_profile(self) -> None:
        self.page.goto("/settings", wait_until="domcontentloaded")

    def expect_details(self, email: str) -> None:
        expect(self.page.get_by_role("heading", name="Settings")).to_be_visible()
        expect(self.page.get_by_role("textbox", name="Email")).to_have_value(email)
