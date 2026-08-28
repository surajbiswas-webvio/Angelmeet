import re

import pytest
from playwright.sync_api import expect


def open_sidebar_on_mobile(page):
    if page.viewport_size and page.viewport_size["width"] < 768:
        menu = page.get_by_role("button", name="Open menu")
        if menu.is_visible(timeout=2000):
            menu.click()


def test_am_nav01_sidebar_shows_all_navigation_links(page):
    page.goto("/home")
    expect(page.get_by_role("heading", name="Home")).to_be_visible()
    open_sidebar_on_mobile(page)
    for name in ["Home", "Meetings", "Calendar", "Notes & Recordings", "Webinars", "Usage", "Billing", "Settings"]:
        expect(page.get_by_role("link", name=name)).to_be_visible()


def test_am_nav02_workspace_switcher_shows_user_info(page):
    page.goto("/home")
    expect(page.get_by_role("heading", name="Home")).to_be_visible()
    open_sidebar_on_mobile(page)
    expect(page.get_by_role("button", name="Switch workspace")).to_be_visible()


def test_am_nav03_sidebar_collapse_works(page):
    if page.viewport_size and page.viewport_size["width"] < 768:
        pytest.skip("Sidebar collapse is desktop-only")
    page.goto("/home")
    page.get_by_role("button", name="Collapse sidebar").click()
    expect(page.get_by_role("button", name="Expand sidebar")).to_be_visible()


def test_am_nav04_account_menu_opens(page):
    page.goto("/home")
    page.get_by_role("button", name="Account menu").click()
    expect(page.get_by_role("menuitem", name=re.compile("logout|sign out", re.I))).to_be_visible()


def test_am_nav05_search_command_palette_opens(page):
    page.goto("/home")
    search = page.get_by_role("button", name=re.compile("Search meetings"))
    if not search.is_visible(timeout=2000):
        search = page.get_by_role("button", name="Search")
    search.click()
    expect(page.get_by_role("dialog")).to_be_visible()


def test_am_nav06_theme_toggle_opens_theme_menu(page):
    page.goto("/home")
    page.get_by_role("button", name="Toggle theme").click()
    for name in ["Light", "Dark", "System"]:
        expect(page.get_by_role("menuitem", name=name)).to_be_visible()


def test_am_nav07_navigates_via_sidebar(page):
    routes = [("Home", "Home"), ("Meetings", "Meetings"), ("Calendar", "Calendar"), ("Notes & Recordings", "Notes & Recordings"), ("Webinars", "Webinars"), ("Usage", "Usage"), ("Billing", "Billing"), ("Settings", "Settings")]
    page.goto("/home")
    for link, heading in routes:
        open_sidebar_on_mobile(page)
        page.get_by_role("link", name=link).click()
        expect(page.get_by_role("heading", name=heading)).to_be_visible()


def test_am_016_searches_meetings(meetings, page):
    meetings.open()
    meetings.expect_ready()
    meetings.search("unlikely-to-match-a-meeting")
    expect(page.get_by_placeholder("Search meetings…")).to_have_value("unlikely-to-match-a-meeting")


def test_am_019_opens_calendar_and_notes(page):
    page.goto("/calendar")
    expect(page.get_by_role("heading", name="Calendar")).to_be_visible()
    page.goto("/ai-notes")
    expect(page.get_by_role("heading", name="Notes & Recordings")).to_be_visible()


def test_am_020_opens_webinars(page):
    page.goto("/webinars")
    expect(page.get_by_role("heading", name="Webinars")).to_be_visible()
    expect(page.get_by_text("attendees watch, panelists present")).to_be_visible()
