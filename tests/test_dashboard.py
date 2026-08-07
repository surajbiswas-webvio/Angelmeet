import pytest

pytestmark = pytest.mark.smoke


def test_am_006_shows_authenticated_dashboard_controls(dashboard):
    dashboard.open()
    dashboard.expect_ready()


def test_am_007_prevents_blank_meeting_joins(dashboard):
    dashboard.open()
    dashboard.join_blank_meeting()


def test_am_010_exposes_instant_and_scheduled_meeting_choices(dashboard):
    dashboard.open()
    dashboard.open_new_meeting_menu()
    dashboard.expect_meeting_choices()
