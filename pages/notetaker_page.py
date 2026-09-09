"""Page Object Model for the user-application AI Notetaker (Notes) workspace."""

from playwright.sync_api import expect

from .base_page import BasePage


class NotetakerPage(BasePage):
    """Encapsulates the Notes & Recordings / AI Notetaker workspace."""

    def open(self) -> None:
        """Navigate to the AI Notetaker workspace, waiting for the DOM to be ready."""
        self.page.goto("/ai-notes", wait_until="domcontentloaded")

    def expect_ready(self) -> None:
        """Assert the Notetaker workspace is rendered (heading and Ask AI button)."""
        expect(self.page.get_by_role("heading", name="Notes & Recordings")).to_be_visible()
        expect(self.page.get_by_role("button", name="Ask AI")).to_be_visible()
