from playwright.sync_api import expect

from .base_page import BasePage


class DashboardPage(BasePage):
    def open(self) -> None:
        self.page.goto("/home", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        expect(self.page.get_by_role("heading", name="Home")).to_be_visible()
        self.expect_visible(self.page.get_by_role("button", name="New meeting"))
        self.expect_visible(self.page.get_by_role("button", name="Join a meeting"))

    def open_new_meeting_menu(self) -> None:
        self.page.get_by_role("button", name="New meeting").click()

    def expect_meeting_choices(self) -> None:
        expect(self.page.get_by_text("Starts now and runs for an hour.")).to_be_visible()
        expect(self.page.get_by_role("button", name="Schedule")).to_be_visible()

    def join_blank_meeting(self) -> None:
        self.page.get_by_role("button", name="Join a meeting").click()
        dialog = self.page.get_by_role("dialog", name="Join a meeting")
        expect(dialog.get_by_role("button", name="Join")).to_be_disabled()
