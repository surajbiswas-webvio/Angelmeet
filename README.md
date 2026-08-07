# AngelMeet Playwright E2E Framework

This repository has been migrated from a JavaScript/TypeScript Playwright setup to a Python-based pytest + Playwright framework for https://meeting.webvio.in/.

## What changed

- Replaced the Node/TypeScript Playwright runner with Python and pytest.
- Preserved the main browser journeys in page-object style classes under the pages package.
- Added pytest fixtures in conftest.py for authenticated browser setup and reusable page objects.
- Integrated Allure reporting to collect results and attachments under reports/.

## Included coverage

The migrated suite covers authenticated dashboard controls, blank meeting-join validation, instant/scheduled meeting choices, navigation to All Meetings and AI Notetaker, profile visibility, and responsive dashboard checks.

## Python setup

1. Create and activate a virtual environment.
   - `py -3 -m venv .venv`
   - `.venv\Scripts\Activate.ps1`
2. Install dependencies.
   - `py -3 -m pip install -r requirements.txt`
3. Install Playwright browsers.
   - `py -3 -m playwright install chromium`
4. Copy `.env.example` to `.env` and set your test account values.

## Running tests

- Run all tests: `pytest`
- Run smoke tests only: `pytest -m smoke`
- Run a single test file: `pytest tests/test_dashboard.py`

## Reporting

- Run tests with Allure output enabled (default): `pytest`
- Generate the report locally: `allure serve reports/allure-results`

## Migration summary

- Converted 3 Python test modules and 7 page-object modules.
- Preserved the core auth flow, dashboard checks, navigation checks, and responsive viewport checks.
- Remaining work may include aligning selectors with the live application if the UI changes.
