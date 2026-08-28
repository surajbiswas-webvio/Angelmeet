from playwright.sync_api import expect

from .base_page import BasePage


class NotetakerPage(BasePage):
    def open(self) -> None:
        self.page.goto("/ai-notes", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        expect(self.page.get_by_role("heading", name="Notes & Recordings")).to_be_visible()
        expect(self.page.get_by_role("button", name="Ask AI")).to_be_visible()
