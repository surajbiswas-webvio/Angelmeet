from datetime import date

from playwright.sync_api import expect


def month_year(value):
    return value.strftime("%B %Y")


def open_calendar(page):
    page.goto("/calendar")
    expect(page.get_by_role("heading", name="Calendar")).to_be_visible()


def test_am_c01_displays_calendar(page):
    open_calendar(page)


def test_am_c02_shows_current_month(page):
    open_calendar(page)
    expect(page.get_by_role("heading", name=month_year(date.today()))).to_be_visible()


def test_am_c03_shows_calendar_navigation_buttons(page):
    open_calendar(page)
    for name in ["Previous", "Today", "Next"]:
        expect(page.get_by_role("button", name=name)).to_be_visible()


def test_am_c04_shows_view_modes(page):
    open_calendar(page)
    for name in ["Month", "Week", "Agenda"]:
        expect(page.get_by_role("button", name=name)).to_be_visible()


def test_am_c05_shows_schedule_button(page):
    open_calendar(page)
    expect(page.get_by_role("button", name="Schedule")).to_be_visible()


def test_am_c06_navigates_previous_month(page):
    open_calendar(page)
    page.get_by_role("button", name="Previous").click()
    current = date.today().replace(day=1)
    previous = current.replace(year=current.year - 1, month=12) if current.month == 1 else current.replace(month=current.month - 1)
    expect(page.get_by_role("heading", name=month_year(previous))).to_be_visible()


def test_am_c07_navigates_next_month(page):
    open_calendar(page)
    page.get_by_role("button", name="Next").click()
    current = date.today().replace(day=1)
    following = current.replace(year=current.year + 1, month=1) if current.month == 12 else current.replace(month=current.month + 1)
    expect(page.get_by_role("heading", name=month_year(following))).to_be_visible()


def test_am_c08_returns_to_today(page):
    open_calendar(page)
    page.get_by_role("button", name="Previous").click()
    page.get_by_role("button", name="Previous").click()
    page.get_by_role("button", name="Today").click()
    expect(page.get_by_role("heading", name=month_year(date.today()))).to_be_visible()


def test_am_c09_switches_to_week_view(page):
    open_calendar(page)
    page.get_by_role("button", name="Week").click()
    expect(page.get_by_role("button", name="Week")).to_be_visible()


def test_am_c10_switches_to_agenda_view(page):
    open_calendar(page)
    page.get_by_role("button", name="Agenda").click()
    expect(page.get_by_role("button", name="Agenda")).to_be_visible()
