"""Base page object shared by all concrete Page Object Models.

Provides small, reusable helpers (navigation, element visibility assertion)
that concrete page objects inherit and build upon.
"""

from playwright.sync_api import Page, expect


class BasePage:
    """Common base class for all page objects in the suite."""

    def __init__(self, page: Page) -> None:
        """Store the Playwright Page this page object operates on."""
        self.page = page

    def expect_visible(self, locator) -> None:
        """Assert that the given locator resolves to a visible element."""
        expect(locator).to_be_visible()

    def open(self, path: str) -> None:
        """Navigate to an application path, waiting for the DOM to be ready."""
        self.page.goto(path, wait_until="domcontentloaded")
