from playwright.sync_api import expect

from .base_page import BasePage


class MeetingsPage(BasePage):
    def open(self) -> None:
        self.page.goto("/meetings", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        expect(self.page.get_by_role("heading", name="Meetings")).to_be_visible()
        expect(self.page.get_by_placeholder("Search meetings…")).to_be_visible()

    def search(self, query: str) -> None:
        self.page.get_by_placeholder("Search meetings…").fill(query)
