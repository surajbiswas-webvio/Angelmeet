# AngelMeet automation audit — 17 August 2026

## Current architecture

The repository contains two duplicate Playwright implementations: the TypeScript suite is the CI runner, while an older Python/pytest suite is still documented as the active framework. The TypeScript suite uses Playwright projects, a storage-state setup test, page objects, HTML/Allure reporting, trace/video/screenshot retention, and retry-on-failure. The Python suite has separate page objects and tests but is not executed in CI.

## Findings

| Area | Audit result | Action |
| --- | --- | --- |
| Target application | All old routes/selectors target `meeting.webvio.in` | Updated TypeScript default to `app.angelmeet.ai` and current routes. |
| Test runner | README says pytest; CI runs Playwright TypeScript | Treat TypeScript as the supported runner; retire Python only after CI migration is formally approved. |
| Authentication | Central environment accessor and storage state are reusable | Kept them; added isolated login-negative tests. |
| Locators | CSS/text selectors were tied to the old UI | Replaced exercised selectors with roles, labels, placeholders, and dialog scope. |
| Synchronization | Assertions previously assumed legacy URLs/text | Waits now use navigation and visible accessible UI state. |
| Coverage | Only dashboard/navigation/responsive happy paths existed | Added authentication, navigation, plan-gating, and non-mutating meeting validation coverage. |
| CI | Uses a caret dependency and a Node runtime incompatible with the resolved latest Playwright | Pinned Playwright 1.56.1; Chromium browser installation remains a CI setup step. |

## New application inventory

Authenticated navigation exposes Home, Meetings, Calendar, Notes & Recordings, Webinars, Usage, Billing, and Settings. The home page supports instant meeting, join-by-code/link, and scheduled-meeting dialogs. Scheduling exposes name, description, date/time, duration, timezone, participants, AI Notetaker, Live Translation, and advanced options. Webinars are present but plan-gated for this account. Settings includes profile, preferences, connected accounts, password, support, and about; billing and usage are read-only for this account.

## Gaps and blocked scope

No Admin Panel URL, admin credentials, or existing Admin automation were present in the repository. Admin CRUD/permissions coverage is therefore blocked pending authorized access details. Live meeting controls (camera, microphone, screen share, recording, chat, reactions, whiteboard, lobby, host/co-host) require a second participant and a disposable meeting workspace; they were not exercised against the shared account. Meeting creation/edit/cancel and destructive CRUD are intentionally not run by default to avoid changing production-like test data.

## Defect found

`AM-008` is intentionally retained as a failing regression: entering a malformed three-character meeting code enables **Join**, despite the UI stating that a six-character code or invite link is required. This should be fixed in the application or explicitly re-specified. The scheduling flow correctly renders `aria-invalid="true"` on the missing meeting name after submission.
