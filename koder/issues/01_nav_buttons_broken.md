# 01 — Navigation Buttons Always Show Next Only

**Type:** Bug
**Component:** ShadcnRenderer
**Status:** Open
**Created:** 2026-03-17

## Description

ShadcnRenderer navigation buttons are broken:

1. **Default state:** Only Next button appears on ALL pages (wrong — should show Previous on pages 2+, Submit on last page)
2. **After aspect change (SM/MD/XL):** Previous and Submit appear on ALL pages (also wrong)
3. **Progress indicator:** Doesn't update when clicking Next to navigate between pages
4. **Submit data issue:** Submit button returns only current page JSON, not all pages' data

## Expected Behavior

- Page 1: Next button only
- Pages 2–N-1: Previous + Next buttons
- Page N: Previous + Submit buttons
- Progress bar updates on each navigation
- Submit returns complete JSON from ALL pages, not just the final page
