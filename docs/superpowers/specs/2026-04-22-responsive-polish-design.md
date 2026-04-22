# Responsive Polish Design Spec

**Date:** 2026-04-22
**Branch:** feature/fg-118
**Approach:** Top-down — establish responsive foundation, then fix pages systematically
**Delivery:** Single PR with all changes

## Overview

Make the entire hilfling-frontend website work well on phones and tablets by fixing responsive issues. The site already has partial responsive support (~6.5/10) — the photo gallery is well-implemented, but breakpoints are inconsistent, spacing is too large on mobile, and many pages lack mobile optimization.

This is a responsive polish effort, not a redesign. No new features, no component redesigns, no backend changes.

## Excluded

- Game pages (`/fg/projects/kull26-leker`) — left as-is
- Dark mode
- PWA features (offline, service workers, install-to-homescreen)
- Component redesigns — layout and sizing adjustments only
- Backend changes

## 1. Responsive Foundation

### Standardized Breakpoints

Use MUI's default breakpoints consistently across the entire app:

| Name | Value   | Target              |
|------|---------|---------------------|
| xs   | 0px     | Phones              |
| sm   | 600px   | Large phones / small tablets |
| md   | 900px   | Tablets             |
| lg   | 1200px  | Desktops            |
| xl   | 1536px  | Large screens       |

All existing non-standard breakpoints (`50rem`, `640px`, `768px`, `1000px`) will be migrated to the closest MUI-aligned value.

### Responsive CSS Variables

In `src/styles/variables.css`, add responsive padding using media queries to redefine CSS custom properties at each breakpoint:

```css
:root {
  --hilfling-default-padding: 0.75rem;
  --hilfling-content-max-width: 1400px;
}

@media (min-width: 600px) {
  :root {
    --hilfling-default-padding: 1rem;
  }
}

@media (min-width: 900px) {
  :root {
    --hilfling-default-padding: 2rem;
  }
}
```

This allows CSS modules to use `var(--hilfling-default-padding)` and get responsive behavior automatically. For components using MUI's `sx` prop, use the breakpoint object syntax directly instead.

### Root Layout Fix

The `<Box sx={{ m: "2rem" }}>` in the root layout becomes responsive:

```tsx
m: { xs: "0.75rem", sm: "1rem", md: "2rem" }
```

### Fix 100vw Usage

Replace `100vw` with `100%` where appropriate to prevent horizontal overflow caused by scrollbar width.

### Files Affected

- `src/styles/variables.css`
- Root layout component (Box with `m: "2rem"`)
- `src/routes/index.module.css`
- `src/components/Header/Header.module.css`
- `src/components/Carousel/Carousel.module.css`
- `src/routes/photos.module.css`
- `src/components/EventCards/EventCards.module.css`
- `src/components/ImagesAdvertisementPopup/ImagesAdvertisementPopup.module.css`

## 2. Header & Navigation

**Current state:** Hamburger menu exists, but nav uses `60vw` width with a `Collapse` animation. Breakpoint at `50rem` (800px).

**Changes:**

- Move breakpoint from `50rem` to `md` (900px)
- Replace `60vw`-width collapsed nav with full-width dropdown beneath the header. Keep existing `Collapse` animation pattern, just fix the width.
- Ensure all nav links/buttons meet minimum 44x44px tap targets on mobile
- Ensure logo scales down gracefully on small screens

**What stays:** Hamburger icon trigger, overall header structure, desktop nav layout.

## 3. Homepage

**Current state:** Two-column layout (10fr / 4fr) at `50rem+`, single column below. Sidebar and Instagram hidden on mobile.

**Changes:**

- Move breakpoint from `50rem` to `md` (900px) for the two-column split
- Single column on mobile: sidebar content (info cards) appears below main content instead of being fully hidden
- Instagram embed: keep hidden on mobile (heavy and not essential)
- Carousel: replace `60vw` height with `aspect-ratio: 16/9` for natural scaling
- Apply responsive padding variables

## 4. Photo Gallery & Image Viewing

**Current state:** Already well-implemented — CSS Grid with 3 tiers (1-col mobile, 6-col tablet, 12-col desktop). Lazy loading in place.

**Changes (minimal):**

- Align breakpoints from `640px`/`1000px` to `600px`/`900px` (MUI `sm`/`md`)
- Verify React Photo View swipe gestures work on touch devices
- Reduce grid gap slightly on `xs` to maximize image size on small phones

## 5. Event Cards

**Current state:** Uses `repeat(auto-fit, minmax(300px, 1fr))` with a `600px` breakpoint.

**Changes:**

- Reduce `minmax(300px, 1fr)` to `minmax(250px, 1fr)` to prevent horizontal scroll on small phones (320px screens can't fit 300px min + padding)
- Verify text truncation and image aspect ratios at smaller sizes
- Verify tap targets on card links

## 6. Authenticated / Member Pages

### FG Hub (`/fg/`)
- Already uses MUI Grid with responsive columns — verify spacing with new responsive padding variables

### Upload Page (`/fg/upload`)
- Form fields full-width on mobile (likely already the case with `xs={12}`)
- Ensure React Dropzone area is large enough for tap interaction and degrades from drag-and-drop to tap-to-select on mobile

### Motive Pages (`/fg/motive/`)
- Tables/list views: wrap in `overflow-x: auto` for horizontal scroll on mobile

### Profile Page (`/fg/profile`)
- Form inputs full-width on `xs`/`sm`
- Profile image: scale down proportionally

### Internal Search (`/intern/search`)
- Search results table: wrap in `overflow-x: auto`
- Search input: full-width on mobile

### Archive Boss Pages (`/fg/archiveBoss/`)
- Inputs stack vertically on mobile
- Data tables: wrap in `overflow-x: auto`

### General Patterns for All Authenticated Pages
- Forms: inputs go full-width below `sm` (600px)
- Tables: horizontal scroll wrapper (`overflow-x: auto`) as default safety net
- MUI Grid: verify responsive column props are set consistently

## 7. Footer & Miscellaneous

### Footer
- Stack content vertically on mobile if currently side-by-side
- Responsive padding matching foundation variables

### Advertisement Popup
- Realign breakpoint from `768px` to `md` (900px) for consistency
- Keep existing mobile adjustments (reduced padding, hidden logo, smaller fonts)

### GuiComponents
- **GuiCard:** Verify no fixed widths that break on mobile
- **GuiCarousel:** Replace viewport-unit-based heights with `aspect-ratio`
- **GuiImage / GuiProfileImage:** Ensure `max-width: 100%` to prevent overflow
- **GuiDropdown / GuiInput:** Full-width on mobile by default
- **GuiTabs:** Add scroll behavior if tabs overflow horizontally (MUI `variant="scrollable"`)

### About Pages
- Mostly text — verify padding and embedded images respect container width

### Login Page
- Center the form, cap `max-width` on desktop, full-width on mobile

## Implementation Order

1. Responsive foundation (breakpoints, variables, root layout, 100vw fixes)
2. Header & navigation
3. Homepage
4. Photo gallery (breakpoint alignment)
5. Event cards
6. Authenticated pages (FG hub, upload, motive, profile, search, archive boss)
7. Footer & miscellaneous components (GuiComponents, about, login, ad popup)

## Testing Strategy

- Test each section at key widths: 320px (small phone), 375px (iPhone), 428px (large phone), 768px (tablet), 1024px (small desktop), 1440px (desktop)
- Verify no horizontal overflow on any page
- Verify touch targets are at least 44x44px
- Verify images don't break out of containers
- Test hamburger navigation on mobile
- Verify React Photo View swipe works on touch
