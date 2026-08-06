# AngelMeet QA Bug Report

## AM-BUG-001 — Empty AI Notetaker pagination displays `NaN`

- **Severity:** Low
- **Priority:** P1
- **Environment:** https://meeting.webvio.in/, authenticated account with zero note records, Chromium, 2026-08-05
- **Steps:** Sign in → open **AI Notetaker**.
- **Expected:** An empty state reports zero entries using valid numbers (for example, “Showing 0 to 0 of 0 Entries”).
- **Actual:** The page shows `Showing NaN to NaN of 0 Entries.`
- **Evidence:** Live UI observation during analysis. No related browser console errors were captured.
- **Recommendation:** Guard pagination range calculations when the result count is zero and add a unit/component test for the empty dataset.
