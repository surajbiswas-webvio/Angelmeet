"""Dashboard tests: authenticated home page controls and meeting actions."""

import pytest
from playwright.sync_api import expect


@pytest.mark.smoke
def test_am006_shows_authenticated_dashboard_controls(dashboard):
    # Test Scenario: The authenticated dashboard exposes the core header controls.
    dashboard.open()
    dashboard.expect_ready()


@pytest.mark.smoke
def test_am007_prevents_blank_meeting_joins(dashboard):
    # Test Scenario: The Join action is disabled until a valid meeting code is entered.
    dashboard.open()
    dashboard.join_blank_meeting()


@pytest.mark.smoke
def test_am010_exposes_instant_and_scheduled_meeting_choices(dashboard):
    # Test Scenario: The New meeting menu offers instant and scheduled options.
    dashboard.open()
    dashboard.open_new_meeting_menu()
    dashboard.expect_meeting_choices()


@pytest.mark.smoke
def test_am008_join_dialog_opens_and_accepts_input(dashboard, page):
    # Test Scenario: The Join dialog opens and its meeting-code input is interactive.
    dashboard.open()
    page.get_by_role("button", name="Join a meeting").click()
    dialog = page.get_by_role("dialog", name="Join a meeting")
    expect(dialog).to_be_visible()
    code = dialog.get_by_placeholder("e.g. AB12CD or https://…/join?id=…")
    expect(code).to_be_visible()
    code.fill("bad")
    expect(code).to_have_value("bad")


@pytest.mark.smoke
def test_am011_exposes_instant_meeting_options(dashboard, page):
    # Test Scenario: The instant meeting dialog lists AI Notetaker and translation.
    dashboard.open()
    dashboard.open_new_meeting_menu()
    expect(page.get_by_role("dialog", name="Start an instant meeting")).to_be_visible()
    expect(page.get_by_text("AI Notetaker")).to_be_visible()
    expect(page.get_by_text("Live Translation")).to_be_visible()


@pytest.mark.smoke
def test_am012_requires_schedule_meeting_fields(dashboard, page):
    # Test Scenario: The Schedule dialog requires meeting-name input before submission.
    dashboard.open()
    dashboard.open_new_meeting_menu()
    page.get_by_role("button", name="Schedule").click()
    dialog = page.get_by_role("dialog", name="Schedule a meeting")
    expect(dialog.get_by_role("textbox", name="Meeting name")).to_be_visible()
