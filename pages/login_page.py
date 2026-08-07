from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from utils.locators import app_locators


class LoginPage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def open(self) -> None:
        self.page.goto(f"{self.base_url}/login")

    def login(self, email: str, password: str) -> None:
        self.page.locator(app_locators["email"]).fill(email)
        self.page.locator(app_locators["password"]).fill(password)
        self.page.locator(app_locators["login"]).click()
        expect(self.page).to_have_url("**/")
