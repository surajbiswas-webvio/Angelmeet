import pytest
from playwright.sync_api import expect

pytestmark = pytest.mark.smoke


@pytest.mark.parametrize(
    "viewport",
    [
        {"name": "mobile", "width": 375, "height": 812},
        {"name": "tablet", "width": 768, "height": 1024},
    ],
)
def test_am_034_dashboard_remains_usable_at_viewport(page, dashboard, viewport):
    page.set_viewport_size({"width": viewport["width"], "height": viewport["height"]})
    dashboard.open()
    dashboard.expect_ready()
    has_horizontal_overflow = page.evaluate("() => document.body.scrollWidth > window.innerWidth")
    assert has_horizontal_overflow is False
