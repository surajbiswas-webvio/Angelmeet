from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from utils.locators import app_locators


class MeetingsPage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def open(self) -> None:
        self.page.goto(f"{self.base_url}/conference-view-list")

    def expect_ready(self) -> None:
        expect(self.page.get_by_role("heading", name="Meeting List View")).to_be_visible()
        expect(self.page.get_by_role("searchbox", name="Search meetings...")).to_be_visible()
