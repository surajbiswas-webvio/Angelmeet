# AngelMeet E2E Automation Framework

End-to-end automation suite for [AngelMeet](https://app.angelmeet.ai/) built with **Playwright + Python (pytest)**.

The suite exercises the user application (`app.angelmeet.ai`) and the admin control plane (`admin.angelmeet.ai`) using the Page Object Model (POM), authenticated storage-state fixtures, environment-driven configuration, and Allure + HTML reporting.

## Prerequisites

- **Python 3.11+** (tested on 3.14)
- **pip**
- A valid `.env` file with test credentials (see [Environment configuration](#environment-configuration))

## Installation

1. Create and activate a virtual environment (recommended):

   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS / Linux
   source .venv/bin/activate
   ```

2. Install Python dependencies:

   ```bash
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

3. Install Playwright browsers:

   ```bash
   python -m playwright install chromium
   ```

   Add `firefox` and `webkit` to the command if you want to run against additional browsers:

   ```bash
   python -m playwright install chromium firefox webkit
   ```

   On Linux CI/runners use `--with-deps` to install OS-level dependencies:

   ```bash
   python -m playwright install --with-deps chromium
   ```

## Environment configuration

Copy `.env.example` to `.env` and fill in real values:

```bash
BASE_URL=https://app.angelmeet.ai
E2E_EMAIL=replace-with-test-account-email
E2E_PASSWORD=replace-with-test-account-password
ADMIN_URL=https://admin.angelmeet.ai
ADMIN_EMAIL=replace-with-admin-email
ADMIN_PASSWORD=replace-with-admin-password
```

- `BASE_URL` / `ADMIN_URL` default to the production URLs if not set.
- `E2E_EMAIL` / `E2E_PASSWORD` are used to authenticate the regular test user.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` are used for the admin control-plane suite.
- Credentials are read from the environment via `config/env.py`. Placeholder values beginning with `replace-with-` cause an immediate error so a misconfigured `.env` fails fast.
- `.env` is gitignored and must never be committed.

The first authenticated test run creates the storage-state files `.auth/user-python.json` and `.auth/admin-python.json`, which are reused for subsequent tests in the session.

## Running tests

Run the full suite:

```bash
python -m pytest
```

Run smoke tests only (marked `@smoke`):

```bash
python -m pytest -m smoke
```

Run an unauthenticated-only selection:

```bash
python -m pytest -m unauthenticated
```

Run a single test file:

```bash
python -m pytest tests/test_dashboard.py
```

Run a single test:

```bash
python -m pytest tests/test_dashboard.py::test_am006_shows_authenticated_dashboard_controls
```

Run tests in headed mode (watch the browser):

```bash
python -m pytest --headed
```

Run with a different browser:

```bash
python -m pytest --browser firefox
python -m pytest --browser webkit
python -m pytest --browser chromium --browser firefox
```

Run in debug mode (Pdb on failure, step through with `--pdb`; or Playwright debug with `PWDEBUG=1`):

```bash
python -m pytest --pdb
PWDEBUG=1 python -m pytest tests/test_dashboard.py
```

Increase verbosity / show skipped reasons:

```bash
python -m pytest -v
python -m pytest -rs
```

## Reporting

The suite is configured for **Allure** reporting (see `pytest.ini`).

Generate a report locally:

```bash
# Requires the standalone allure CLI (https://allurereport.org/docs/install/)
allure generate allure-results --clean -o allure-report
allure open allure-report
```

Raw Allure results are written to `allure-results/`. HTML output goes to `allure-report/`. Both are gitignored.

If Playwright's built-in artifact handling is needed, `pytest-playwright` saves screenshots and traces on failure under the last-run directory when enabled; artifact output is temporary and not committed.

## Project structure

```
config/
    env.py                 # Environment/settings loader with validation
pages/
    __init__.py
    base_page.py           # BasePage (open, expect_visible helpers)
    login_page.py          # Login page object
    dashboard_page.py      # Dashboard page object
    meetings_page.py       # Meetings page object
    notetaker_page.py      # AI Notetaker page object
    profile_page.py        # Profile/settings page object
tests/
    test_authentication.py # AM-001..003, regression login cases
    test_dashboard.py      # AM-006..008, AM-010..012 dashboard controls
    test_navigation.py     # AM-015..020, AM-NAV01..07 navigation
    test_calendar.py       # AM-C01..10 calendar
    test_notes.py          # AM-N01..07 AI notes & recordings
    test_settings_billing.py # AM-S01..07, AM-U01..02, AM-B01..02
    test_responsive.py     # Responsive layout across viewports
    test_unauthenticated.py # AM-UN01..09 login/logout flows
    test_admin.py          # ADMIN-* admin control-plane coverage
conftest.py                # pytest fixtures (page objects, auth storage states)
requirements.txt           # Python dependencies
pytest.ini                 # pytest configuration and markers
.env.example               # Environment template
```

## How auth works

- `conftest.py` exposes a `page` fixture that builds a Playwright context.
- Tests marked `@pytest.mark.unauthenticated` get an empty browser context.
- All other tests authenticate once per session through the `user_storage_state` fixture, which logs in and saves the storage state to `.auth/user-python.json`.
- Admin tests use `admin_page` / `admin_page_empty` fixtures and the `admin_storage_state` session fixture against `ADMIN_URL`.

## Adding new tests

1. **Page object first** - Add a class in `pages/` (or extend an existing one) that encapsulates selectors and reusable actions for the new feature.
2. **Reuse fixtures** - Use the `page`, `dashboard`, `meetings`, `notetaker`, or `profile` fixtures from `conftest.py`; avoid creating ad-hoc contexts.
3. **Write the test** - Add a `test_*.py` file under `tests/` (or extend a related file). Name tests `test_<area>_<behavior>` and keep assertions precise (e.g. `exact=True` when a plain match is ambiguous).
4. **Mark appropriately** - Add `@pytest.mark.smoke` for fast critical-path checks and `@pytest.mark.unauthenticated` whenever the test must run without a session.
5. **Run and verify**:

   ```bash
   python -m pytest tests/test_my_feature.py -v
   ```

## Notes

- Selectors rely on ARIA roles, labels, and placeholders rather than fragile CSS paths where possible.
- Some tests intentionally skip when the live UI does not expose a control (documented per test). Review skip reasons with `python -m pytest -rs`.
- The admin suite requires valid `ADMIN_EMAIL` / `ADMIN_PASSWORD` credentials; if the admin app cannot be reached or the credentials are rejected, those tests error and should be run against a reachable, correctly configured admin environment.