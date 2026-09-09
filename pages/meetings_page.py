"""Page Object Model for the user-application Meetings page."""

from playwright.sync_api import expect

from .base_page import BasePage


class MeetingsPage(BasePage):
    """Encapsulates the Meetings workspace and its search functionality."""

    def open(self) -> None:
        """Navigate to the meetings workspace, waiting for the DOM to be ready."""
        self.page.goto("/meetings", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        """Assert the meetings page is rendered (heading and search box)."""
        expect(self.page.get_by_role("heading", name="Meetings")).to_be_visible()
        expect(self.page.get_by_placeholder("Search meetings…")).to_be_visible()

    def search(self, query: str) -> None:
        """Type the given query into the meetings search box."""
        self.page.get_by_placeholder("Search meetings…").fill(query)
