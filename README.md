# AngelMeet Playwright E2E Framework

Production-oriented Playwright + TypeScript starter framework for https://meeting.webvio.in/.

## Included coverage

Implemented, non-destructive smoke checks cover authenticated dashboard controls, empty join validation, meeting creation choices, navigation to All Meetings and AI Notetaker, profile visibility, and responsive dashboard readiness. The accompanying test catalogue identifies the next modules to automate: scheduling, meeting-room media, chat, participants, screen share, whiteboard, recording, waiting room, and security cases.

## Setup and execution

1. Copy `.env.example` to `.env` and set a dedicated test account.
2. Run `npm ci`.
3. Run `npx playwright install`.
4. Run `npm test` or `npm run test:smoke`.
5. View `playwright-report/index.html`; run `npm run report:allure` after installing the Allure CLI output dependencies.

The framework reads all secrets from environment variables. Do not commit `.env` or `.auth/user.json`.

## Architecture

| Location | Responsibility |
| --- | --- |
| `tests/` | Business-facing, independently runnable test specifications. |
| `pages/` | Page Object Model actions and assertions for application workflows. |
| `fixtures/` | Shared typed page objects and authenticated test context. |
| `locators/` | Centralized stable locator contracts. |
| `config/` | Environment configuration and guarded secret access. |
| `helpers/` | Reusable test data such as malformed URLs and viewports. |
| `utilities/` | Cross-cutting utilities including execution attachments. |
| `outputs/angelmeet-qa/` | QA test catalogue and Excel verification preview. |
| `.github/workflows/` | CI pipeline and report artifact publishing. |

## Reliability decisions

- No hard-coded waits: Playwright assertions provide state-aware synchronization.
- Automatic screenshots, video, and trace capture are retained on failure.
- Retries are enabled (two in CI) and projects are parallel by default.
- Login runs as a setup project and produces isolated storage state for browser projects.
- WebRTC flows should use two isolated browser contexts plus Chromium fake media flags in CI. Browser permission prompts cannot be operated as native UI; grant permissions through Playwright context configuration and use synthetic media.

## Scalability recommendations

Request `data-testid` attributes for meeting-room controls, room state, toasts, and schedule form fields before deep WebRTC automation. Provision an API/fixture-backed disposable meeting and two test identities so create, join, waiting-room, chat, and screen-sharing tests can be repeatable without polluting production data. Add API contract tests and axe accessibility scans once test-environment endpoints are available.
