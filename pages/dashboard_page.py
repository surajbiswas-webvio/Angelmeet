from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from utils.locators import app_locators


class DashboardPage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def open(self) -> None:
        self.page.goto(self.base_url)

    def expect_ready(self) -> None:
        expect(self.page.get_by_role("heading", name="Video calls and meetings for everyone")).to_be_visible()
        self.expect_visible(self.page.locator(app_locators["new_meeting"]))
        self.expect_visible(self.page.locator(app_locators["join_input"]))

    def open_new_meeting_menu(self) -> None:
        self.page.locator(app_locators["new_meeting"]).click()

    def expect_meeting_choices(self) -> None:
        expect(self.page.get_by_role("heading", name="Start instant meeting")).to_be_visible()
        expect(self.page.get_by_role("heading", name="Schedule meeting")).to_be_visible()

    def join_blank_meeting(self) -> None:
        self.page.locator(app_locators["join"]).click()
        expect(self.page.get_by_role("alert")).to_contain_text("Please enter meeting URL")
