import re

from playwright.sync_api import expect


def admin_dashboard(page):
    page.goto("/login")
    expect(page.get_by_text("Tenants")).to_be_visible()


def test_admin_001_login_page_renders(admin_page_empty):
    admin_page_empty.goto("/login")
    expect(admin_page_empty.locator("#email")).to_be_visible()
    expect(admin_page_empty.locator("#password")).to_be_visible()
    expect(admin_page_empty.get_by_role("button", name="Sign in")).to_be_visible()
    expect(admin_page_empty.get_by_text("Control plane")).to_be_visible()


def test_admin_002_rejects_invalid_credentials(admin_page_empty):
    admin_page_empty.goto("/login")
    admin_page_empty.locator("#email").fill("invalid@admin.com")
    admin_page_empty.locator("#password").fill("wrongpassword")
    admin_page_empty.get_by_role("button", name="Sign in").click()
    expect(admin_page_empty).to_have_url(re.compile(r"/login(?:$|[?#])"))


def test_admin_003_to_007_overview(admin_page):
    admin_dashboard(admin_page)
    for text in ["Users", "Meetings today", "Live now", "Usage by type"]:
        expect(admin_page.get_by_text(text)).to_be_visible()
    expect(admin_page.get_by_role("button", name="Refresh")).to_be_visible()
    expect(admin_page.get_by_role("button", name="Exit to app")).to_be_visible()


MODULES = [
    "Overview", "Tenants", "Live now", "Meetings", "Usage", "Analytics", "Economics",
    "Plans & Billing", "Feature Flags", "AI", "Notifications", "Integrations", "Settings",
    "Audit Log", "Security", "System Health", "Admins & Roles",
]


def test_admin_nav_all_modules_have_content(admin_page):
    admin_dashboard(admin_page)
    for module in MODULES:
        admin_page.get_by_role("button", name=module).click()
        expect(admin_page.locator("main")).not_to_be_empty()


def test_admin_tenants_page_shows_table_and_controls(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Tenants").click()
    expect(admin_page.get_by_role("cell", name="Account")).to_be_visible()
    expect(admin_page.get_by_role("button", name="Onboard tenant")).to_be_visible()
    expect(admin_page.get_by_placeholder(re.compile("search tenants", re.I))).to_be_visible()
    expect(admin_page.get_by_text("All statuses")).to_be_visible()


def test_admin_meetings_page_shows_table_and_filters(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Meetings").click()
    expect(admin_page.get_by_role("heading", name="Meetings")).to_be_visible()
    expect(admin_page.get_by_role("cell", name="Meeting")).to_be_visible()
    expect(admin_page.get_by_text("All types")).to_be_visible()
    expect(admin_page.get_by_text("All statuses")).to_be_visible()


def test_admin_usage_page_shows_metrics(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Usage").click()
    expect(admin_page.get_by_text("Resource")).to_be_visible()
    expect(admin_page.get_by_text("Quantity")).to_be_visible()


def test_admin_analytics_shows_revenue_and_plan_mix(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Analytics").click()
    expect(admin_page.get_by_text("Revenue")).to_be_visible()
    expect(admin_page.get_by_text("Plan mix")).to_be_visible()


def test_admin_economics_shows_revenue_cost_and_tenant_cost(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Economics").click()
    for text in ["Revenue", "Cost (MTD)", "Cost per tenant"]:
        expect(admin_page.get_by_text(text)).to_be_visible()


def test_admin_plans_show_cards_and_invoices(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Plans & Billing").click()
    for text in ["Free", "Pro", "Business", "Invoices"]:
        expect(admin_page.get_by_text(text, exact=True)).to_be_visible()


def test_admin_feature_flags_show_status(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Feature Flags").click()
    for text in ["ADVANCED_ANALYTICS", "Status", "Rollout"]:
        expect(admin_page.get_by_text(text)).to_be_visible()


def test_admin_ai_shows_providers_and_routing(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="AI").click()
    expect(admin_page.get_by_text("Providers & models")).to_be_visible()
    expect(admin_page.get_by_text("Routing")).to_be_visible()


def test_admin_settings_shows_emergency_controls(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Settings").click()
    for text in ["Emergency controls", "Disable new registrations", "Maintenance mode"]:
        expect(admin_page.get_by_text(text)).to_be_visible()


def test_admin_audit_log_shows_entries(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Audit Log").click()
    for text in ["When", "Actor", "Action"]:
        expect(admin_page.get_by_text(text)).to_be_visible()


def test_admin_security_shows_mfa_and_events(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Security").click()
    expect(admin_page.get_by_text("MFA")).to_be_visible()
    expect(admin_page.get_by_text("Security events")).to_be_visible()


def test_admin_system_health_shows_services(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="System Health").click()
    expect(admin_page.get_by_text("All systems operational")).to_be_visible()
    expect(admin_page.get_by_text("Database", exact=True)).to_be_visible()


def test_admin_notifications_show_templates(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Notifications").click()
    expect(admin_page.get_by_text("Templates")).to_be_visible()


def test_admin_integrations_show_google_calendar(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Integrations").click()
    expect(admin_page.get_by_text("Google Calendar")).to_be_visible()


def test_admin_roles_show_permissions_and_superadmin(admin_page):
    admin_dashboard(admin_page)
    admin_page.get_by_role("button", name="Admins & Roles").click()
    expect(admin_page.get_by_text("Roles & permissions")).to_be_visible()
    expect(admin_page.get_by_text("Superadmin")).to_be_visible()
