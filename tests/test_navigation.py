import pytest

from utils.env import get_email

pytestmark = pytest.mark.smoke


def test_am_015_opens_all_meetings_workspace(meetings):
    meetings.open()
    meetings.expect_ready()


def test_am_018_opens_ai_notetaker_workspace(notetaker):
    notetaker.open()
    notetaker.expect_ready()


def test_am_030_displays_profile_details(dashboard, profile):
    dashboard.open()
    profile.open_profile()
    profile.expect_details(get_email() or "")
