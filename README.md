# AngelMeet Playwright E2E Framework

This repository's supported CI runner is the TypeScript Playwright framework for https://app.angelmeet.ai/.

## What changed

- Uses Playwright projects, authenticated storage state, page objects, and environment-based credentials.
- Retains HTML and Allure reporting, screenshots, videos, and traces on failure.
- The Python files are a legacy duplicate suite and are not part of CI; see `AUTOMATION_AUDIT.md` before removing them.

## Included coverage

The migrated suite covers authenticated dashboard controls, blank meeting-join validation, instant/scheduled meeting choices, navigation to All Meetings and AI Notetaker, profile visibility, and responsive dashboard checks.

## Playwright setup

1. Install dependencies: `npm install`.
2. Install Playwright browsers: `npx playwright install chromium`.
3. Copy `.env.example` to `.env` and set your test account values.

## Running tests

- Run all tests: `npm test`
- Run smoke tests only: `npm run test:smoke`
- Run a single test file: `npx playwright test tests/dashboard.spec.ts`
- Run headed mode: `npm run test:headed`

Before running browser tests, create a local `.env` file from `.env.example` and fill in valid `E2E_EMAIL` and `E2E_PASSWORD` values.

## Reporting

- Generate the HTML report: `npm run report:html`
- Generate Allure: `npm run report:allure`

## Migration summary

- Converted 3 Python test modules and 7 page-object modules.
- Preserved the core auth flow, dashboard checks, navigation checks, and responsive viewport checks.
- Remaining work may include aligning selectors with the live application if the UI changes.
