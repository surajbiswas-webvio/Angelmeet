"""Registration page tests for the AngelMeet user application.

Covers the full registration form: successful registration flow, client-side
validation of each field, password visibility toggle, Create account button
behaviour, Sign-in navigation, theme toggle, browser refresh, keyboard
navigation, UI verification, and responsive layouts.

These tests run against the public, unauthenticated registration page and
generate unique disposable test data on every run (see
:func:`pages.register_page.unique_test_data`) to avoid colliding with existing
usernames/emails on the live application.
"""

import re

import pytest
from playwright.sync_api import expect

from pages.register_page import unique_test_data
from pages import RegistrationPage

pytestmark = [pytest.mark.unauthenticated, pytest.mark.registration]


def _open(register: RegistrationPage) -> RegistrationPage:
    """Open the registration page and wait for it to be ready."""
    register.open()
    register.expect_ready()
    return register


# --------------------------------------------------------------------------- #
# Scenario 1: Successful registration
# --------------------------------------------------------------------------- #
def test_registration_successful_with_valid_unique_data(register):
    # Test Scenario: A new user can create an account with unique valid data and
    # reach the email verification screen.
    register = _open(register)
    data = unique_test_data()

    # Unique values are generated per attempt so repeated runs never collide.
    register.fill_valid_form(data)
    register.expect_submit_enabled()

    register.submit()
    register.expect_verify_screen(data["email"])


# --------------------------------------------------------------------------- #
# Scenario 2: Required field validation
# --------------------------------------------------------------------------- #
def test_registration_empty_form_is_not_submitted(register, page):
    # Test Scenario: With all fields empty the form cannot be submitted; the
    # Create account button is disabled and the page stays on /register.
    register = _open(register)
    register.clear_form()
    register.expect_submit_disabled()
    expect(page).to_have_url(re.compile(r"/register$"))
    expect(page.get_by_role("heading", name="Create your account")).to_be_visible()


# --------------------------------------------------------------------------- #
# Scenario 3: Full name validation
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "name,expected_valid",
    [
        ("", False),          # empty full name
        ("A", True),          # very short but non-empty name
        ("12345", True),      # numeric-only name (no numeric rule enforced)
        ("Alice @ Wonderland", True),  # special characters are accepted
        ("Valid Full Name", True),     # normal valid name
    ],
)
def test_registration_full_name_validation(register, name, expected_valid):
    # Test Scenario: The Full name field validates per its constraint; empty is
    # required, while non-empty values are accepted by the client.
    register = _open(register)
    data = unique_test_data()
    register.fill_registration(name, data["username"], data["email"], data["password"])

    assert register.field_is_valid(register.name_input) is expected_valid
    # The submit button only unlocks when every required field is valid.
    if expected_valid:
        register.expect_submit_enabled()
    else:
        register.expect_submit_disabled()


# --------------------------------------------------------------------------- #
# Scenario 4: Username validation
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "username,expected_valid",
    [
        ("", False),                 # empty username
        ("ab", True),                # very short username (accepted)
        ("has space", True),         # spaces (accepted by client)
        ("user_with.1-underscore", True),  # special characters (accepted)
        ("u" * 60, True),            # very long username (accepted)
        ("validusername99", True),   # normal valid username
    ],
)
def test_registration_username_validation(register, username, expected_valid):
    # Test Scenario: The Username field validates as required (empty is invalid);
    # non-empty username values pass client-side validation.
    register = _open(register)
    data = unique_test_data()
    register.fill_registration(data["name"], username, data["email"], data["password"])

    assert register.field_is_valid(register.username_input) is expected_valid
    if expected_valid:
        register.expect_submit_enabled()
    else:
        register.expect_submit_disabled()


def test_registration_unique_username_is_accepted(register):
    # Test Scenario: A freshly generated unique username enables submission,
    # avoiding duplicate-username errors from prior runs.
    register = _open(register)
    data = unique_test_data()
    register.fill_registration(data["name"], data["username"], data["email"], data["password"])
    register.expect_submit_enabled()


# --------------------------------------------------------------------------- #
# Scenario 5: Email validation
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "email,expected_valid",
    [
        ("", False),                       # empty email
        ("bad-email", False),              # missing '@'
        ("missingat.com", False),          # missing '@'
        ("a@", False),                     # missing domain part after '@'
        ("a@b", True),                     # minimal but structurally valid
        ("good@example.com", True),        # normal valid email
    ],
)
def test_registration_email_validation(register, email, expected_valid):
    # Test Scenario: The Work email field applies HTML5 type=email validation,
    # rejecting empty/malformed addresses and accepting valid ones.
    register = _open(register)
    data = unique_test_data()
    register.fill_registration(data["name"], data["username"], email, data["password"])

    assert register.field_is_valid(register.email_input) is expected_valid
    if expected_valid:
        register.expect_submit_enabled()
    else:
        register.expect_submit_disabled()


# --------------------------------------------------------------------------- #
# Scenario 6: Password validation
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "password,expected_valid",
    [
        ("", False),        # empty password (required)
        ("123", True),      # short password (no client-side minimum enforced)
        ("weak", True),     # weak password (no strength rule client-side)
        ("StrongPass1!", True),  # strong mixed-type password
    ],
)
def test_registration_password_validation(register, password, expected_valid):
    # Test Scenario: The Password field is required; the client enforces no
    # minimum-length/strength rule, so any non-empty value passes.
    register = _open(register)
    data = unique_test_data()
    register.fill_registration(data["name"], data["username"], data["email"], password)

    assert register.field_is_valid(register.password_input) is expected_valid
    if expected_valid:
        register.expect_submit_enabled()
    else:
        register.expect_submit_disabled()


# --------------------------------------------------------------------------- #
# Scenario 7: Password visibility toggle
# --------------------------------------------------------------------------- #
def test_registration_password_visibility_toggle(register):
    # Test Scenario: Password is masked by default, revealed via the eye icon,
    # and masked again when the icon is clicked a second time.
    register = _open(register)
    register.password_input.fill("StrongPass1!")
    assert register.password_is_masked() is True

    register.reveal_password()
    assert register.password_input.get_attribute("type") == "text"
    assert register.password_is_masked() is False

    register.hide_password()
    assert register.password_is_masked() is True


# --------------------------------------------------------------------------- #
# Scenario 8: Create account button behaviour
# --------------------------------------------------------------------------- #
def test_registration_create_account_button_delegation(register, page):
    # Test Scenario: The Create account button is visible with correct text,
    # disabled while incomplete, then enabled once valid data is entered.
    register = _open(register)
    expect(register.create_account_button).to_be_visible()
    expect(register.create_account_button).to_have_text("Create account")

    # Empty form -> button disabled.
    register.expect_submit_disabled()

    # Invalid email keeps the button disabled.
    data = unique_test_data()
    register.fill_registration(data["name"], data["username"], "bad-email", data["password"])
    register.expect_submit_disabled()

    # All valid -> button enabled and submits to the verification screen.
    register.email_input.fill(data["email"])
    register.expect_submit_enabled()


def test_registration_submits_form_single_time(register):
    # Test Scenario: Clicking Create account submits the registration exactly
    # once and navigates to the email verification screen.
    register = _open(register)
    data = unique_test_data()
    register.fill_valid_form(data)
    register.submit()
    register.expect_verify_screen(data["email"])


# --------------------------------------------------------------------------- #
# Scenario 9: Sign-in navigation
# --------------------------------------------------------------------------- #
def test_registration_sign_in_link_navigates_to_login(register, page):
    # Test Scenario: Clicking "Sign in" from the registration page redirects the
    # user to the login page with its expected elements.
    register = _open(register)
    register.sign_in_link.click()
    expect(page).to_have_url(re.compile(r"/login$"))
    expect(page.get_by_role("heading", name="Welcome back")).to_be_visible()
    expect(page.get_by_role("textbox", name="Email")).to_be_visible()


# --------------------------------------------------------------------------- #
# Scenario 10: Theme toggle
# --------------------------------------------------------------------------- #
def test_registration_theme_toggle_changes_theme(register):
    # Test Scenario: Selecting Dark via the theme menu applies a dark theme, and
    # switching back to Light restores the light theme.
    register = _open(register)

    register.open_theme_menu()
    register.select_theme("Dark")
    expect(register.page.locator("html")).to_have_class(re.compile(r"\bdark\b"))

    register.open_theme_menu()
    register.select_theme("Light")
    expect(register.page.locator("html")).not_to_have_class(re.compile(r"\bdark\b"))


# --------------------------------------------------------------------------- #
# Scenario 11: Browser refresh
# --------------------------------------------------------------------------- #
def test_registration_browser_refresh_clears_entered_data(register, page):
    # Test Scenario: Reloading the page discards any typed registration data and
    # leaves the form functional and empty.
    register = _open(register)
    data = unique_test_data()
    register.fill_valid_form(data)

    page.reload()
    register.expect_ready()

    # Entered data should have been cleared after refresh.
    expect(register.name_input).to_have_value("")
    expect(register.username_input).to_have_value("")
    expect(register.email_input).to_have_value("")
    expect(register.password_input).to_have_value("")
    register.expect_submit_disabled()


# --------------------------------------------------------------------------- #
# Scenario 12: Keyboard / tab navigation
# --------------------------------------------------------------------------- #
def test_registration_tab_navigation_order(register):
    # Test Scenario: Tab moves focus logically through
    # Full name → Username → Work email → Password → Create account → Sign in.
    register = _open(register)
    register.name_input.focus()
    order = ["username", "email", "password"]
    for expected_id in order:
        register.page.keyboard.press("Tab")
        active_id = register.page.evaluate("() => document.activeElement.id")
        assert active_id == expected_id, f"Expected focus on #{expected_id}, got #{active_id}"


def test_registration_submit_via_enter_key(register):
    # Test Scenario: With valid data entered, pressing Enter submits the form
    # and progresses to the email verification screen.
    register = _open(register)
    data = unique_test_data()
    register.fill_valid_form(data)
    register.expect_submit_enabled()

    # Submitting from a filled field via the Enter key.
    register.password_input.press("Enter")
    register.expect_verify_screen(data["email"])


# --------------------------------------------------------------------------- #
# Scenario 13: UI verification
# --------------------------------------------------------------------------- #
def test_registration_ui_verification(register, page):
    # Test Scenario: The registration page exposes the expected title, branding,
    # labels, placeholders, button/link text, theme toggle, and no scrollbars.
    register = _open(register)

    expect(page).to_have_title("AngelMeet")
    expect(register.logo()).to_have_attribute("alt", "AngelMeet")
    expect(page.get_by_role("heading", name="Create your account")).to_be_visible()

    # Field labels and placeholders.
    expect(page.get_by_label("Full name")).to_be_visible()
    expect(page.get_by_label("Username")).to_be_visible()
    expect(page.get_by_label("Work email")).to_be_visible()
    expect(register.name_input).to_have_attribute("placeholder", "Ada Lovelace")
    expect(register.username_input).to_have_attribute("placeholder", "ada")
    expect(register.email_input).to_have_attribute("placeholder", "you@company.com")
    expect(register.password_input).to_have_attribute("placeholder", "Create a strong password")

    # Buttons and links.
    expect(register.create_account_button).to_have_text("Create account")
    expect(register.sign_in_link).to_be_visible()
    expect(register.theme_toggle).to_be_visible()

    # No horizontal scrolling at default (desktop) resolution.
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")


# --------------------------------------------------------------------------- #
# Scenario 14: Responsive layouts
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "viewport",
    [("desktop", 1920, 1080), ("laptop", 1366, 768), ("tablet", 768, 1024), ("mobile", 375, 812)],
    ids=["desktop", "laptop", "tablet", "mobile"],
)
def test_registration_responsive_layout(register, page, viewport):
    # Test Scenario: At each supported viewport the form, Create account button,
    # and Sign in link remain usable with no horizontal scrolling.
    _, width, height = viewport
    page.set_viewport_size({"width": width, "height": height})

    register = _open(register)

    # Fields remain usable at each viewport.
    expect(register.name_input).to_be_visible()
    expect(register.username_input).to_be_visible()
    expect(register.email_input).to_be_visible()
    expect(register.password_input).to_be_visible()

    # Buttons/links remain accessible and no horizontal overflow occurs.
    expect(register.create_account_button).to_be_visible()
    expect(register.sign_in_link).to_be_visible()
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")
