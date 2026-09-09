"""Responsive tests: layouts across desktop, laptop, tablet, and mobile viewports."""

import pytest
from playwright.sync_api import expect

# Viewport presets used to exercise the app at each breakpoint.
VIEWPORTS = [("desktop", 1920, 1080), ("laptop", 1366, 768), ("tablet", 768, 1024), ("mobile", 375, 812)]


@pytest.fixture(params=VIEWPORTS, ids=[viewport[0] for viewport in VIEWPORTS])
def viewport(request):
    """Return the (name, width, height) tuple for each viewport preset."""
    return request.param


def assert_no_horizontal_overflow(page):
    """Assert the page body does not overflow horizontally at the current viewport."""
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")


@pytest.mark.parametrize("route,heading", [("/home", "Home"), ("/settings", "Settings"), ("/calendar", "Calendar"), ("/meetings", "Meetings"), ("/ai-notes", "Notes & Recordings"), ("/usage", "Usage"), ("/billing", "Billing"), ("/webinars", "Webinars")])
def test_responsive_authenticated_pages(page, route, heading, viewport):
    # Test Scenario: Each authenticated workspace renders with no horizontal overflow at every viewport.
    _, width, height = viewport
    page.set_viewport_size({"width": width, "height": height})
    page.goto(route)
    expect(page.get_by_role("heading", name=heading, exact=heading == "Usage")).to_be_visible()
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")


@pytest.mark.unauthenticated
def test_responsive_login(viewport, page):
    # Test Scenario: The login page renders without overflow at every viewport.
    _, width, height = viewport
    page.set_viewport_size({"width": width, "height": height})
    page.goto("/login")
    expect(page.get_by_role("heading", name="Welcome back")).to_be_visible()
    expect(page.get_by_role("textbox", name="Email")).to_be_visible()
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")


def test_responsive_join_dialog(viewport, page):
    # Test Scenario: The Join dialog renders without overflow at every viewport.
    _, width, height = viewport
    page.set_viewport_size({"width": width, "height": height})
    page.goto("/home")
    page.get_by_role("button", name="Join a meeting").click()
    expect(page.get_by_role("dialog", name="Join a meeting")).to_be_visible()
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")


def test_sidebar_visible_on_desktop(page):
    # Test Scenario: The sidebar nav links are visible on desktop.
    page.set_viewport_size({"width": 1920, "height": 1080})
    page.goto("/home")
    expect(page.get_by_role("link", name="Home")).to_be_visible()
    expect(page.get_by_role("link", name="Meetings")).to_be_visible()


def test_sidebar_visible_on_tablet(page):
    # Test Scenario: The dashboard has no horizontal overflow at tablet width.
    page.set_viewport_size({"width": 768, "height": 1024})
    page.goto("/home")
    assert_no_horizontal_overflow(page)


def test_dashboard_controls_visible_on_mobile(page):
    # Test Scenario: Core dashboard controls remain visible on mobile.
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto("/home")
    expect(page.get_by_role("button", name="New meeting")).to_be_visible()
    expect(page.get_by_role("button", name="Join a meeting")).to_be_visible()


@pytest.mark.unauthenticated
@pytest.mark.parametrize("viewport", VIEWPORTS, ids=[viewport[0] for viewport in VIEWPORTS])
def test_login_form_usable_at_each_viewport(viewport, page):
    # Test Scenario: The login form fields are editable at each viewport.
    _, width, height = viewport
    page.set_viewport_size({"width": width, "height": height})
    page.goto("/login")
    expect(page.get_by_role("textbox", name="Email")).to_be_editable()
    expect(page.get_by_role("textbox", name="Password")).to_be_editable()
