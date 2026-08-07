from playwright.sync_api import Locator, Page, expect


class BasePage:
    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url

    def expect_visible(self, locator: Locator) -> None:
        expect(locator).to_be_visible()
