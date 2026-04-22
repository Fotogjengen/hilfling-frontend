# Intern Search Page - Mobile Responsive Design

## Overview

Make the intern search ("internsok") page mobile-friendly by switching from a side-by-side layout to a stacked layout on small screens, with a collapsible search form.

## Breakpoint

Use `900px` to match the project's existing MUI breakpoint convention (see `variables.css` and other responsive work on this branch).

- **Desktop (>=900px):** Current side-by-side layout unchanged.
- **Mobile (<900px):** Stacked layout, search form on top, results below.

## Layout Changes

### Desktop (>=900px)

No changes. The existing `display: flex` with `gap: 1rem` remains. Search form stays as a sidebar, results take `flex: 1`.

### Mobile (<900px)

- `.internSearch` switches to `flex-direction: column`.
- Search form renders first (top), results below.
- The `order: 2` on `.gridDivContainer` is removed on mobile so DOM order is preserved (form first, results second).

### Search Form Inputs (Mobile)

- Remove the fixed `300px` width (`boxwidth`) on all inputs. Inputs become full-width.
- Date pickers ("Dato fra" / "Dato til") sit side-by-side in a row using a flex container.
- Checkboxes ("Hoydepunkter" / "Analog") remain in their row (already handled by MUI `FormGroup`).
- The "Sok" button becomes full-width.

## Collapsible Search Form (Mobile Only)

- Wrap the search form content in MUI `<Collapse>`.
- Add a toggle button ("Vis filter" / "Skjul filter") that is only visible on mobile (<900px).
- After the user taps "Sok", the form auto-collapses on mobile.
- The form starts expanded on page load.
- On desktop, the form is always visible and the toggle button is hidden.

### State Management

- Add `isFilterOpen` boolean state in the route component (`search.tsx`), default `true`.
- Pass `isFilterOpen` and a toggle handler to `InternSearchInput`, or manage collapse at the route level wrapping the input component.
- On search submit, set `isFilterOpen = false` (only effective on mobile since desktop ignores collapse).

## Results Table (Mobile)

- Add `overflow-x: auto` to the table container so the wide table is horizontally scrollable.
- No columns removed — all data remains accessible via horizontal scroll.

## Files to Modify

1. **`src/components/InternSearch/internSearch.module.css`** — Add media query for stacked layout, responsive input widths, toggle button visibility, table scroll.
2. **`src/routes/_authenticated/intern/search.tsx`** — Add `isFilterOpen` state, collapse toggle, pass to form or wrap form in `<Collapse>`.
3. **`src/components/InternSearch/InternSearchInput.tsx`** — Remove fixed `boxwidth` (use responsive width), add flex row for date pickers on mobile.

## Out of Scope

- Redesigning the results table for mobile (e.g., card layout). Horizontal scroll is sufficient for now.
- Changes to the desktop layout.
- Changes to search functionality or API calls.
