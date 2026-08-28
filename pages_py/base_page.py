from playwright.sync_api import Page, expect


class BasePage:
    def __init__(self, page: Page) -> None:
        self.page = page

    def expect_visible(self, locator) -> None:
        expect(locator).to_be_visible()

    def open(self, path: str) -> None:
        self.page.goto(path, wait_until="domcontentloaded")
