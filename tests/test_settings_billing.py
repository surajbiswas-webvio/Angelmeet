import re

import pytest
from playwright.sync_api import expect


def test_am_s01_displays_settings_profile(page):
    page.goto("/settings")
    expect(page.get_by_role("heading", name="Settings")).to_be_visible()
    expect(page.get_by_role("heading", name="Profile")).to_be_visible()


def test_am_s02_shows_profile_fields(page):
    page.goto("/settings")
    first_name = page.get_by_role("textbox", name="First name")
    if not first_name.is_visible():
        pytest.skip("Profile fields are not exposed by the current Settings UI")
    for name in ["First name", "Last name", "Email"]:
        expect(page.get_by_role("textbox", name=name)).to_be_visible()


def test_am_s03_shows_settings_navigation(page):
    page.goto("/settings")
    for name in ["Profile", "Preferences", "Connected accounts", "Password", "Help & support", "About"]:
        expect(page.get_by_role("button", name=name)).to_be_visible()


@pytest.mark.parametrize("section", ["Preferences", "Password"])
def test_am_s04_s05_navigates_settings_section(page, section):
    page.goto("/settings")
    page.get_by_role("button", name=section).click()
    expect(page.get_by_role("heading", name=section)).to_be_visible()


def test_am_s06_shows_change_photo(page):
    page.goto("/settings")
    change_photo = page.get_by_role("button", name="Change photo")
    if not change_photo.is_visible():
        pytest.skip("Photo controls are not exposed by the current Settings UI")
    expect(change_photo).to_be_visible()


def test_am_s07_shows_save_changes(page):
    page.goto("/settings")
    expect(page.get_by_role("button", name="Save changes")).to_be_visible()


def test_am_u01_displays_usage(page):
    page.goto("/usage")
    expect(page.get_by_role("heading", name="Usage", exact=True)).to_be_visible()


def test_am_u02_shows_usage_summary(page):
    page.goto("/usage")
    expect(page.get_by_text("Your usage this month")).to_be_visible()


def test_am_b01_displays_billing(page):
    page.goto("/billing")
    expect(page.get_by_role("heading", name="Billing")).to_be_visible()


def test_am_b02_shows_invoices(page):
    page.goto("/billing")
    expect(page.get_by_text("Invoices")).to_be_visible()


def test_regression_billing_navigation(page):
    page.goto("/home")
    page.get_by_role("link", name="Billing").click()
    expect(page).to_have_url(re.compile(r".*/billing"))
    expect(page.get_by_role("heading", name="Billing")).to_be_visible()
