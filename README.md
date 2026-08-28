# AngelMeet Playwright E2E Framework

This repository contains TypeScript and Python Playwright E2E runners for https://app.angelmeet.ai/.

## What changed

- Uses Playwright projects, authenticated storage state, page objects, and environment-based credentials.
- Retains HTML and Allure reporting, screenshots, videos, and traces on failure.
- The Python suite uses pytest-playwright and mirrors the TypeScript behavior without modifying the TypeScript source suite.

## Included coverage

The migrated suite covers authenticated dashboard controls, blank meeting-join validation, instant/scheduled meeting choices, navigation to All Meetings and AI Notetaker, profile visibility, and responsive dashboard checks.

## TypeScript Playwright setup

1. Install dependencies: `npm install`.
2. Install Playwright browsers: `npx playwright install chromium`.
3. Copy `.env.example` to `.env` and set your test account values.

## Running tests

- Run all tests: `npm test`
- Run smoke tests only: `npm run test:smoke`
- Run a single test file: `npx playwright test tests/dashboard.spec.ts`
- Run headed mode: `npm run test:headed`

Transient Playwright artifacts are written to the system temporary directory by default to avoid file-locking issues when the repository is stored in OneDrive. Set `PLAYWRIGHT_OUTPUT_DIR` to use a custom location.

Before running browser tests, create a local `.env` file from `.env.example` and fill in valid `E2E_EMAIL`, `E2E_PASSWORD`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` values. Admin tests also require a reachable `ADMIN_URL`.

## Python Playwright setup

1. Install dependencies: `python -m pip install -r requirements.txt`.
2. Install browsers: `python -m playwright install chromium`.
3. Use the same `.env` values described above.

## Python test commands

- Run the migrated suite: `python -m pytest`.
- Run smoke tests: `python -m pytest -m smoke`.
- Run admin tests: `python -m pytest tests_py/test_admin.py`.

The Python suite creates `.auth/user-python.json` and `.auth/admin-python.json` locally after successful login. Credentials are read from dotenv and are never stored in source files.

## Reporting

- Generate the HTML report: `npm run report:html`
- Generate Allure: `npm run report:allure`

## Migration summary

- Added pytest-playwright configuration, dotenv validation, user/admin storage-state fixtures, and reusable page objects.
- Mirrored authentication, dashboard, meetings, notes, navigation, calendar, settings, usage/billing, admin, and responsive coverage.
- Selectors remain aligned with the TypeScript suite and may need updates if the live UI changes.
