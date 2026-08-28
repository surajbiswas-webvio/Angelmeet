from playwright.sync_api import expect


def test_am_n01_displays_notes_page(page, notetaker):
    notetaker.open()
    expect(page.get_by_role("heading", name="Notes & Recordings")).to_be_visible()


def test_am_n02_shows_ask_ai_section(page, notetaker):
    notetaker.open()
    expect(page.get_by_role("heading", name="Ask AI about your meetings")).to_be_visible()


def test_am_n03_shows_notes_and_recordings_tabs(page, notetaker):
    notetaker.open()
    expect(page.get_by_role("tab", name="AI Notes")).to_be_visible()
    expect(page.get_by_role("tab", name="Recordings")).to_be_visible()


def test_am_n04_shows_ask_ai_button(page, notetaker):
    notetaker.open()
    expect(page.get_by_role("button", name="Ask AI")).to_be_visible()


def test_am_n05_shows_ask_ai_input(page, notetaker):
    notetaker.open()
    expect(page.get_by_placeholder("what did we decide about pricing?")).to_be_visible()


def test_am_n06_shows_recent_notes(page, notetaker):
    notetaker.open()
    expect(page.get_by_role("heading", name="RECENT NOTES")).to_be_visible()


def test_am_n07_switches_to_recordings(page, notetaker):
    notetaker.open()
    page.get_by_role("tab", name="Recordings").click()
    expect(page.get_by_role("tab", name="Recordings")).to_have_attribute("data-state", "active")
