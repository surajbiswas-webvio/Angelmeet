"""Calendar tests: rendering, month navigation, and view-mode switching."""

from datetime import date

from playwright.sync_api import expect


def month_year(value):
    """Format a date as an uppercase month name plus year (e.g. 'September 2026')."""
    return value.strftime("%B %Y")


def open_calendar(page):
    """Open the Calendar workspace and wait for its heading to be visible."""
    page.goto("/calendar")
    expect(page.get_by_role("heading", name="Calendar")).to_be_visible()


def test_am_c01_displays_calendar(page):
    # Test Scenario: The Calendar workspace renders.
    open_calendar(page)


def test_am_c02_shows_current_month(page):
    # Test Scenario: The calendar displays the current month/year.
    open_calendar(page)
    expect(page.get_by_role("heading", name=month_year(date.today()))).to_be_visible()


def test_am_c03_shows_calendar_navigation_buttons(page):
    # Test Scenario: Previous / Today / Next navigation buttons are present.
    open_calendar(page)
    for name in ["Previous", "Today", "Next"]:
        expect(page.get_by_role("button", name=name)).to_be_visible()


def test_am_c04_shows_view_modes(page):
    # Test Scenario: Month / Week / Agenda view-mode buttons are present.
    open_calendar(page)
    for name in ["Month", "Week", "Agenda"]:
        expect(page.get_by_role("button", name=name)).to_be_visible()


def test_am_c05_shows_schedule_button(page):
    # Test Scenario: The Schedule button is present on the calendar.
    open_calendar(page)
    expect(page.get_by_role("button", name="Schedule")).to_be_visible()


def test_am_c06_navigates_previous_month(page):
    # Test Scenario: Clicking Previous shows the preceding month/year.
    open_calendar(page)
    page.get_by_role("button", name="Previous").click()
    current = date.today().replace(day=1)
    previous = current.replace(year=current.year - 1, month=12) if current.month == 1 else current.replace(month=current.month - 1)
    expect(page.get_by_role("heading", name=month_year(previous))).to_be_visible()


def test_am_c07_navigates_next_month(page):
    # Test Scenario: Clicking Next shows the following month/year.
    open_calendar(page)
    page.get_by_role("button", name="Next").click()
    current = date.today().replace(day=1)
    following = current.replace(year=current.year + 1, month=1) if current.month == 12 else current.replace(month=current.month + 1)
    expect(page.get_by_role("heading", name=month_year(following))).to_be_visible()


def test_am_c08_returns_to_today(page):
    # Test Scenario: Clicking Today returns to the current month after navigating away.
    open_calendar(page)
    page.get_by_role("button", name="Previous").click()
    page.get_by_role("button", name="Previous").click()
    page.get_by_role("button", name="Today").click()
    expect(page.get_by_role("heading", name=month_year(date.today()))).to_be_visible()


def test_am_c09_switches_to_week_view(page):
    # Test Scenario: The calendar can be switched to Week view.
    open_calendar(page)
    page.get_by_role("button", name="Week").click()
    expect(page.get_by_role("button", name="Week")).to_be_visible()


def test_am_c10_switches_to_agenda_view(page):
    # Test Scenario: The calendar can be switched to Agenda view.
    open_calendar(page)
    page.get_by_role("button", name="Agenda").click()
    expect(page.get_by_role("button", name="Agenda")).to_be_visible()
