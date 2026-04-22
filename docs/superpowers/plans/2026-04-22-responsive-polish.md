# Responsive Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire hilfling-frontend website work well on phones and tablets by standardizing breakpoints, fixing spacing, and making every page responsive.

**Architecture:** Top-down approach — first establish responsive CSS variables and fix the root layout, then fix layout components (header, footer), then work through each page. All breakpoints align to MUI defaults (sm: 600px, md: 900px, lg: 1200px).

**Tech Stack:** React 18, TypeScript, MUI 5, CSS Modules, Vite, TanStack Router

---

### Task 1: Responsive CSS Variables

**Files:**
- Modify: `src/styles/variables.css`

- [ ] **Step 1: Add responsive padding variables with media queries**

Replace the static `--hilfling-default-padding` and add responsive overrides in `src/styles/variables.css`. Change the `:root` block to add media query overrides after it:

```css
/* In the :root block, change line 12 from: */
--hilfling-default-padding: 2rem;
/* to: */
--hilfling-default-padding: 0.75rem;
```

Then add these media query blocks after the closing `}` of `:root` (after line 62):

```css
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

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/variables.css
git commit -m "feat: add responsive padding CSS variables"
```

---

### Task 2: Root Layout Responsive Margin

**Files:**
- Modify: `src/routes/__root.tsx:95`

- [ ] **Step 1: Change the fixed margin to responsive breakpoints**

In `src/routes/__root.tsx`, change line 95 from:

```tsx
<Box sx={{ m: "2rem" }}>
```

to:

```tsx
<Box sx={{ m: { xs: "0.75rem", sm: "1rem", md: "2rem" } }}>
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: make root layout margin responsive"
```

---

### Task 3: Header & Navigation Responsive Fix

**Files:**
- Modify: `src/components/Header/Header.module.css`

The header currently uses a `50rem` (800px) breakpoint and `60vw` nav width. We need to:
- Change the breakpoint to `900px` (MUI `md`)
- Replace `60vw` with `100%` for the nav list
- Replace `3vw` margin with a fixed `1.5rem`
- Add minimum tap target sizes for mobile links

- [ ] **Step 1: Update the nav list width and spacing**

In `src/components/Header/Header.module.css`, change lines 67-75 from:

```css
.navList {
  width: 60vw;
  display: flex;
  justify-content: left;
  align-items: center;
}

.navList > * {
  margin-right: 3vw;
}
```

to:

```css
.navList {
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
}

.navList > * {
  margin-right: 1.5rem;
}
```

- [ ] **Step 2: Change the breakpoint from 50rem to 900px**

In the same file, change lines 81-88 from:

```css
@media screen and (min-width: 50rem) {
  .navContainer {
    display: grid;
  }
  .hamburger {
    display: none;
  }
}
```

to:

```css
@media screen and (min-width: 900px) {
  .navContainer {
    display: grid;
  }
  .hamburger {
    display: none;
  }
}
```

- [ ] **Step 3: Add minimum tap target size for mobile menu links**

In the same file, change lines 32-39 (the `.menuLink` rule) from:

```css
.menuLink {
  padding: 0.2rem 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 3px 0px;
}
```

to:

```css
.menuLink {
  padding: 0.75rem 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 3px 0px;
}
```

- [ ] **Step 4: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header/Header.module.css
git commit -m "feat: fix header responsive breakpoint and nav width"
```

---

### Task 4: Carousel Responsive Fix

**Files:**
- Modify: `src/components/Frontpage/Carousel/Carousel.module.css`

The carousel uses `60vw` / `40vw` heights which are too tall on mobile. Replace with `aspect-ratio`.

- [ ] **Step 1: Replace vw heights with aspect-ratio**

Replace the entire content of `src/components/Frontpage/Carousel/Carousel.module.css` with:

```css
.container {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.img {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.arrows {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0px;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.597);
  bottom: 0.5rem;
  padding: 0.2rem 0rem;
  position: absolute;
  width: 60%;
  display: flex;
  justify-content: space-between;
}

.arrows > * {
  cursor: pointer;
}

.arrows > *:active {
  transform: scale(1.1);
  cursor: pointer;
}
```

This removes the media query entirely — `aspect-ratio: 16/9` scales naturally at all sizes.

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Frontpage/Carousel/Carousel.module.css
git commit -m "feat: replace carousel vw heights with aspect-ratio"
```

---

### Task 5: Homepage Responsive Fix

**Files:**
- Modify: `src/routes/index.module.css`

The homepage uses a `50rem` breakpoint and hides sidebar content on mobile. We change the breakpoint to `900px` and show the sidebar below main content on mobile.

- [ ] **Step 1: Update the homepage grid breakpoint and mobile layout**

Replace the entire content of `src/routes/index.module.css` with:

```css
* {
  box-sizing: border-box;
}

.contentContainer {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.CaroContainer {
  display: flex;
  justify-content: center;
}

.fakeCaro {
  width: 100%;
  min-height: 25rem;
  background-color: rgb(226, 132, 117);
  display: flex;
  align-items: center;
  justify-content: center;
}

.insta {
  display: none;
}

.rightSide {
  display: flex;
  flex-direction: column;
}

.rightSide > * {
  margin-bottom: 1rem;
}

@media screen and (min-width: 900px) {
  .contentContainer {
    grid-template-columns: 10fr 4fr;
  }

  .insta {
    display: contents;
  }
}
```

Key changes:
- Breakpoint: `50rem` → `900px`
- Gap: `2.5rem` → `1.5rem` (less wasted space on mobile)
- The `.rightSide` div is no longer hidden on mobile — it will appear below the main content in the single-column grid. The Instagram embed is the only thing hidden.

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.module.css
git commit -m "feat: fix homepage responsive breakpoint and show sidebar on mobile"
```

---

### Task 6: Photo Gallery Breakpoint Alignment

**Files:**
- Modify: `src/routes/photos.module.css`

Align breakpoints from `1000px`/`640px` to `900px`/`600px` (MUI `md`/`sm`). Also fix the `min-width` values on grid items that cause overflow on mobile.

- [ ] **Step 1: Update breakpoints and fix min-width overflow**

In `src/routes/photos.module.css`, change lines 28-42 from:

```css
@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .w4 {
    grid-column: span 3;
  } /* 2 per rad */
  .w6 {
    grid-column: span 6;
  } /* 1 per rad */
  .w12 {
    grid-column: span 6;
  }
}
```

to:

```css
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .w4 {
    grid-column: span 3;
  } /* 2 per rad */
  .w6 {
    grid-column: span 6;
  } /* 1 per rad */
  .w12 {
    grid-column: span 6;
  }
}
```

- [ ] **Step 2: Update mobile breakpoint**

Change lines 44-55 from:

```css
/* Mobil */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .w4,
  .w6,
  .w12 {
    grid-column: span 1;
  }
}
```

to:

```css
/* Mobil */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 4px;
  }

  .w4,
  .w6,
  .w12 {
    grid-column: span 1;
  }
}
```

- [ ] **Step 3: Fix min-width values that cause overflow on mobile**

Change lines 70-84 from:

```css
/* Helrad-bilder litt lavere → roligere layout */
.w12.item {
  min-height: 700px;

  min-width: 1000px;
}

.w6.item {
  min-width: 500px;
  max-width: 700px;
}

.w4.item {
  min-width: 300px;
  max-width: 500px;
}
```

to:

```css
/* Helrad-bilder litt lavere → roligere layout */
.w12.item {
  min-height: 700px;
}

.w6.item {
  max-width: 700px;
}

.w4.item {
  max-width: 500px;
}
```

Removing `min-width` prevents items from overflowing their grid cells on small screens.

- [ ] **Step 4: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/photos.module.css
git commit -m "feat: align photo gallery breakpoints to MUI standards and fix overflow"
```

---

### Task 7: Event Cards Responsive Fix

**Files:**
- Modify: `src/components/Frontpage/EventCards/EventCards.module.css`

The event cards already have a good mobile breakpoint at `600px`. The main fix is ensuring the card image doesn't cause layout issues.

- [ ] **Step 1: Add max-width to card image for safety**

In `src/components/Frontpage/EventCards/EventCards.module.css`, change lines 34-36 from:

```css
.cardImg {
  width: 40%;
  box-shadow: var(--box-shadow-1);
  aspect-ratio: 4 / 3;
}
```

to:

```css
.cardImg {
  width: 40%;
  max-width: 100%;
  box-shadow: var(--box-shadow-1);
  aspect-ratio: 4 / 3;
}
```

- [ ] **Step 2: Ensure card text doesn't overflow on small screens**

Change lines 39-41 from:

```css
.cardText {
  width: fit-content;
  gap: 0.2rem;
  padding: 0.5rem 1rem;
}
```

to:

```css
.cardText {
  width: fit-content;
  min-width: 0;
  gap: 0.2rem;
  padding: 0.5rem 1rem;
}
```

Adding `min-width: 0` prevents flex children from overflowing their container.

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Frontpage/EventCards/EventCards.module.css
git commit -m "feat: fix event card overflow on small screens"
```

---

### Task 8: Footer Responsive Fix

**Files:**
- Modify: `src/gui-components/GuiFooter/GuiFooter.module.css`

The footer sections use `flex: 1` with `padding: 20px 60px` which is too wide on mobile. The "follow" link has a fixed `margin-left: 32%` that breaks on small screens.

- [ ] **Step 1: Add responsive stacking and fix padding**

In `src/gui-components/GuiFooter/GuiFooter.module.css`, change lines 12-28 from:

```css
.footerContent {
  display: flex;
  padding: 20px 0;
  width: 100%;
  max-width: var(--hilfling-max-width);
  margin: 0 auto;
  flex-wrap: wrap;
}

.section {
  flex: 1;
  text-align: center;
  padding: 20px 60px 20px 60px;
}

.follow {
  display: flex;
  margin-left: 32%;
}
```

to:

```css
.footerContent {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  width: 100%;
  max-width: var(--hilfling-max-width);
  margin: 0 auto;
}

.section {
  flex: 1;
  text-align: center;
  padding: 20px var(--hilfling-default-padding);
}

.follow {
  display: flex;
  justify-content: center;
}

@media (min-width: 900px) {
  .footerContent {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .section {
    padding: 20px 60px;
  }
}
```

Key changes:
- Footer sections stack vertically on mobile (`flex-direction: column`), switch to row at `md` (900px)
- Section padding uses the responsive variable on mobile, fixed `60px` on desktop
- "Follow" link centered with `justify-content: center` instead of fixed `margin-left: 32%`

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/gui-components/GuiFooter/GuiFooter.module.css
git commit -m "feat: make footer stack vertically on mobile"
```

---

### Task 9: Advertisement Popup Breakpoint Alignment

**Files:**
- Modify: `src/components/ImagesAdvertisementPopup/ImagesAdvertisementPopup.module.css`

Align the breakpoint from `768px` to `900px` for consistency.

- [ ] **Step 1: Change the media query breakpoint**

In `src/components/ImagesAdvertisementPopup/ImagesAdvertisementPopup.module.css`, change line 80 from:

```css
@media (max-width: 768px) {
```

to:

```css
@media (max-width: 900px) {
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ImagesAdvertisementPopup/ImagesAdvertisementPopup.module.css
git commit -m "feat: align ad popup breakpoint to 900px"
```

---

### Task 10: Profile Page Responsive Fix

**Files:**
- Modify: `src/routes/_authenticated/_fgAuthenticated/fg/profile.module.css`

The profile page has many fixed pixel widths (`577px`, `271px`, `225px`) that overflow on mobile. These need to become responsive.

- [ ] **Step 1: Fix the info card layout for mobile**

In `src/routes/_authenticated/_fgAuthenticated/fg/profile.module.css`, change lines 186-193 from:

```css
.infoCard {
  /* Contains profile picture and personal info*/
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}
```

to:

```css
.infoCard {
  /* Contains profile picture and personal info*/
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

@media (min-width: 900px) {
  .infoCard {
    flex-direction: row;
    align-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 2: Fix profile picture sizing for mobile**

Change lines 160-174 from:

```css
.profilePicture {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: white;
  width: 225px;
  height: 225px;
  border-radius: 50%;
  margin-right: 48px;
  margin-left: 16px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

to:

```css
.profilePicture {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: white;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

@media (min-width: 900px) {
  .profilePicture {
    width: 225px;
    height: 225px;
    margin-right: 48px;
    margin-left: 16px;
  }
}
```

- [ ] **Step 3: Fix fixed-width info boxes for mobile**

Change lines 38-49 from:

```css
.admissionSemester {
  display: flex;
  flex-direction: column;
  background-color: #be3144;
  height: 272px;
  width: 577px;
  border-radius: 5px;
  padding-left: 20px;
  margin: 0px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

to:

```css
.admissionSemester {
  display: flex;
  flex-direction: column;
  background-color: #be3144;
  height: 272px;
  width: 100%;
  max-width: 577px;
  border-radius: 5px;
  padding-left: 20px;
  margin: 0px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

- [ ] **Step 4: Fix positions box width**

Change lines 73-83 from:

```css
.positions {
  display: flex;
  flex-direction: column;
  background-color: #872341;
  height: 272px;
  width: 271px;
  border-radius: 5px;
  padding-left: 20px;
  overflow: hidden;
  margin-right: 16px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

to:

```css
.positions {
  display: flex;
  flex-direction: column;
  background-color: #872341;
  height: 272px;
  width: 100%;
  max-width: 271px;
  border-radius: 5px;
  padding-left: 20px;
  overflow: hidden;
  margin-right: 16px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

- [ ] **Step 5: Fix personal information box width**

Change lines 114-125 from:

```css
.personalInformation {
  display: flex;
  flex-direction: column;
  background-color: #e17564;
  height: 225px;
  width: 577px;
  border-radius: 5px;
  /* padding-left: 20px;  */
  margin: 0px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

to:

```css
.personalInformation {
  display: flex;
  flex-direction: column;
  background-color: #e17564;
  height: 225px;
  width: 100%;
  max-width: 577px;
  border-radius: 5px;
  /* padding-left: 20px;  */
  margin: 0px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
```

- [ ] **Step 6: Scale down the name display font on mobile**

Change lines 195-203 from:

```css
.nameDisplay {
  display: flex;
  flex-direction: column;
  font-size: 73px;
  font-style: normal;
  font-weight: normal;
  margin-top: 0px;
  padding: 0px;
}
```

to:

```css
.nameDisplay {
  display: flex;
  flex-direction: column;
  font-size: clamp(2rem, 8vw, 73px);
  font-style: normal;
  font-weight: normal;
  margin-top: 0px;
  padding: 0px;
}
```

- [ ] **Step 7: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add src/routes/_authenticated/_fgAuthenticated/fg/profile.module.css
git commit -m "feat: make profile page responsive with fluid widths"
```

---

### Task 11: Intern Search Responsive Fix

**Files:**
- Modify: `src/routes/_authenticated/intern/internSearch.module.css`

The intern search has a fixed `15%` toggle width and a side-by-side layout that doesn't work on mobile.

- [ ] **Step 1: Make the search layout stack on mobile**

In `src/routes/_authenticated/intern/internSearch.module.css`, change lines 1-4 from:

```css
.internSearch {
  display: flex;
  gap: 1rem;
}
```

to:

```css
.internSearch {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 900px) {
  .internSearch {
    flex-direction: row;
  }
}
```

- [ ] **Step 2: Fix the toggle component width for mobile**

Change lines 38-41 from:

```css
.toggleComponent {
  width: 15%;
  padding: 1rem;
}
```

to:

```css
.toggleComponent {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 900px) {
  .toggleComponent {
    width: 15%;
  }
}
```

- [ ] **Step 3: Add overflow scroll to grid container for mobile safety**

Change lines 15-19 from:

```css
.gridContainer {
  padding: 0.5rem;
  background-color: whitesmoke;
  border-radius: 1rem;
}
```

to:

```css
.gridContainer {
  padding: 0.5rem;
  background-color: whitesmoke;
  border-radius: 1rem;
  overflow-x: auto;
}
```

- [ ] **Step 4: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_authenticated/intern/internSearch.module.css
git commit -m "feat: make intern search page responsive"
```

---

### Task 12: Archive Boss Responsive Fix

**Files:**
- Modify: `src/routes/_authenticated/_fgAuthenticated/fg/archiveBoss/archiveBoss.module.css`

The archive boss page has a fixed `33%` width for items and a `60%` width alert container that doesn't work on mobile.

- [ ] **Step 1: Fix items width and alert container for mobile**

In `src/routes/_authenticated/_fgAuthenticated/fg/archiveBoss/archiveBoss.module.css`, change lines 13-17 from:

```css
.items {
  margin-top: 0.8rem;
  flex-grow: 1;
  width: 33%;
}
```

to:

```css
.items {
  margin-top: 0.8rem;
  flex-grow: 1;
  width: 100%;
}

@media (min-width: 900px) {
  .items {
    width: 33%;
  }
}
```

- [ ] **Step 2: Fix alert container positioning for mobile**

Change lines 35-43 from:

```css
.alertContainer {
  position: fixed;
  display: flex;
  justify-content: center;
  width: 60%;

  z-index: 20;
  top: 1rem;
  left: 20%;
}
```

to:

```css
.alertContainer {
  position: fixed;
  display: flex;
  justify-content: center;
  width: calc(100% - 2rem);
  z-index: 20;
  top: 1rem;
  left: 1rem;
}

@media (min-width: 900px) {
  .alertContainer {
    width: 60%;
    left: 20%;
  }
}
```

- [ ] **Step 3: Fix the upload page padding for mobile**

In `src/routes/_authenticated/_fgAuthenticated/fg/upload.module.css`, change lines 1-4 from:

```css
.photoUpload {
  background-color: white;
  padding: 2rem;
}
```

to:

```css
.photoUpload {
  background-color: white;
  padding: var(--hilfling-default-padding);
}
```

Also change line 1 of `archiveBoss.module.css` from:

```css
.archiveBoss {
  background-color: white;
  padding: 2rem;
}
```

to:

```css
.archiveBoss {
  background-color: white;
  padding: var(--hilfling-default-padding);
}
```

- [ ] **Step 4: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/_authenticated/_fgAuthenticated/fg/archiveBoss/archiveBoss.module.css src/routes/_authenticated/_fgAuthenticated/fg/upload.module.css
git commit -m "feat: make archive boss and upload pages responsive"
```

---

### Task 13: Login Page Responsive Fix

**Files:**
- Modify: `src/routes/login.tsx`

The login form uses `width: "80%"` which works but isn't centered and has no max-width on desktop. Add centering and a max-width.

- [ ] **Step 1: Wrap the login form with centered container**

In `src/routes/login.tsx`, change lines 61-99 from:

```tsx
  return (
    <div>
      <FormControl sx={{ m: 1, width: "80%" }} variant="standard">
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="standard"
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "80%" }} variant="standard">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "80%" }}
        onClick={handleLogin}
      >
        LOGG INN
      </Button>
    </div>
  );
```

to:

```tsx
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="standard"
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={handleLogin}
      >
        LOGG INN
      </Button>
    </div>
  );
```

Also update the authenticated logout section (lines 46-58) similarly:

```tsx
  if (isAuthenticated) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2>Du er logget inn</h2>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, width: "100%" }}
          onClick={handleLogout}
        >
          Logg ut
        </Button>
      </div>
    );
  }
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/login.tsx
git commit -m "feat: center and constrain login form for mobile and desktop"
```

---

### Task 14: About Page & GuiTabs Responsive Fix

**Files:**
- Modify: `src/routes/about/about.module.css`
- Modify: `src/gui-components/GuiTabs/GuiTabs.module.css`

The about page's `.gangBangers` uses `flex-wrap` which works, but the GuiTabs can overflow horizontally if the viewport is too narrow.

- [ ] **Step 1: Ensure about page member grid works on small screens**

In `src/routes/about/about.module.css`, change lines 57-61 from:

```css
.gangBangers {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
```

to:

```css
.gangBangers {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
```

- [ ] **Step 2: Make GuiTabs scrollable on small screens**

In `src/gui-components/GuiTabs/GuiTabs.module.css`, change the `.tab` rule (lines 4-12) from:

```css
.tab {
  color: white;
  height: 41px;
  min-width: 115px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
}
```

to:

```css
.tab {
  color: white;
  height: 41px;
  min-width: 70px;
  flex: 1;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
}
```

Then in `src/gui-components/GuiTabs/index.tsx`, change line 21 from:

```tsx
    <div>
```

to:

```tsx
    <div style={{ display: "flex", width: "100%" }}>
```

This makes tabs flex to fill available width instead of overflowing.

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/about/about.module.css src/gui-components/GuiTabs/GuiTabs.module.css src/gui-components/GuiTabs/index.tsx
git commit -m "feat: fix about page layout and make tabs responsive"
```

---

### Task 15: Final Build Verification and Visual Check

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No new lint errors introduced.

- [ ] **Step 3: Start dev server for visual verification**

Run: `npm run dev`

Manually verify at these viewport widths (use browser DevTools responsive mode):
- **320px** (small phone) — no horizontal overflow on any page
- **375px** (iPhone) — all pages readable and usable
- **768px** (tablet) — two-column layouts kick in where appropriate
- **1440px** (desktop) — nothing broken by the changes

Pages to check:
- `/` (homepage)
- `/photos` (photo gallery)
- `/about` (about page)
- `/login` (login page)
- `/search` (search page)
- `/fg` (FG hub, if authenticated)
- `/fg/profile` (profile page)
- `/fg/upload` (upload page)
- `/fg/archiveBoss` (archive boss)
- `/intern/search` (intern search)

- [ ] **Step 4: Commit any fixes discovered during visual check**

If any issues are found during visual verification, fix them and commit.

- [ ] **Step 5: Final commit message**

If no issues found, no additional commit needed. The branch is ready for PR.
