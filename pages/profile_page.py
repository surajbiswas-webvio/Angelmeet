"""Page Object Model for the user-application profile / settings page."""

from playwright.sync_api import expect

from .base_page import BasePage


class ProfilePage(BasePage):
    """Encapsulates profile/details presentation and the account menu."""

    def open_menu(self) -> None:
        """Open the account (user) menu in the top navigation."""
        self.page.get_by_role("button", name="Account menu").click()

    def open_profile(self) -> None:
        """Navigate directly to the settings (profile) page."""
        self.page.goto("/settings", wait_until="domcontentloaded")

    def expect_details(self, email: str) -> None:
        """Assert the profile page shows the expected email address."""
        expect(self.page.get_by_role("heading", name="Settings")).to_be_visible()
        expect(self.page.get_by_role("textbox", name="Email")).to_have_value(email)
