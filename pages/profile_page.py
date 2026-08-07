from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from utils.locators import app_locators


class ProfilePage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def open_menu(self) -> None:
        self.page.locator(app_locators["profile"]).click()

    def open_profile(self) -> None:
        self.open_menu()
        self.page.get_by_role("link", name="My Profile").click()

    def expect_details(self, email: str) -> None:
        expect(self.page.get_by_role("dialog", name="User Profile Details")).to_be_visible()
        expect(self.page.get_by_role("dialog")).to_contain_text(email)
