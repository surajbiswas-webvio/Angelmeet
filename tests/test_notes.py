"""Notes & Recordings (AI Notetaker) tests: page sections and tabs."""

from playwright.sync_api import expect


def test_am_n01_displays_notes_page(page, notetaker):
    # Test Scenario: The Notes & Recordings workspace renders with its heading.
    notetaker.open()
    expect(page.get_by_role("heading", name="Notes & Recordings")).to_be_visible()


def test_am_n02_shows_ask_ai_section(page, notetaker):
    # Test Scenario: The "Ask AI about your meetings" section is present.
    notetaker.open()
    expect(page.get_by_role("heading", name="Ask AI about your meetings")).to_be_visible()


def test_am_n03_shows_notes_and_recordings_tabs(page, notetaker):
    # Test Scenario: AI Notes and Recordings tabs are both present.
    notetaker.open()
    expect(page.get_by_role("tab", name="AI Notes")).to_be_visible()
    expect(page.get_by_role("tab", name="Recordings")).to_be_visible()


def test_am_n04_shows_ask_ai_button(page, notetaker):
    # Test Scenario: The Ask AI action button is present.
    notetaker.open()
    expect(page.get_by_role("button", name="Ask AI")).to_be_visible()


def test_am_n05_shows_ask_ai_input(page, notetaker):
    # Test Scenario: The Ask AI prompt input box is present.
    notetaker.open()
    expect(page.get_by_placeholder("what did we decide about pricing?")).to_be_visible()


def test_am_n06_shows_recent_notes(page, notetaker):
    # Test Scenario: The recent-notes section heading is present.
    notetaker.open()
    expect(page.get_by_role("heading", name="RECENT NOTES")).to_be_visible()


def test_am_n07_switches_to_recordings(page, notetaker):
    # Test Scenario: Clicking the Recordings tab activates it.
    notetaker.open()
    page.get_by_role("tab", name="Recordings").click()
    expect(page.get_by_role("tab", name="Recordings")).to_have_attribute("data-state", "active")
