"""Page Object Model for the user-application dashboard (home) page."""

from playwright.sync_api import expect

from .base_page import BasePage


class DashboardPage(BasePage):
    """Encapsulates the dashboard/home page and its meeting actions."""

    def open(self) -> None:
        """Navigate to the home dashboard, waiting for the DOM to be ready."""
        self.page.goto("/home", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        """Assert the dashboard is rendered (heading and core action buttons)."""
        expect(self.page.get_by_role("heading", name="Home")).to_be_visible()
        self.expect_visible(self.page.get_by_role("button", name="New meeting"))
        self.expect_visible(self.page.get_by_role("button", name="Join a meeting"))

    def open_new_meeting_menu(self) -> None:
        """Open the "New meeting" menu."""
        self.page.get_by_role("button", name="New meeting").click()

    def expect_meeting_choices(self) -> None:
        """Assert the instant/scheduled meeting choices are presented."""
        expect(self.page.get_by_text("Starts now and runs for an hour.")).to_be_visible()
        expect(self.page.get_by_role("button", name="Schedule")).to_be_visible()

    def join_blank_meeting(self) -> None:
        """Open the Join dialog and assert the Join action is disabled until input."""
        self.page.get_by_role("button", name="Join a meeting").click()
        dialog = self.page.get_by_role("dialog", name="Join a meeting")
        expect(dialog.get_by_role("button", name="Join")).to_be_disabled()
