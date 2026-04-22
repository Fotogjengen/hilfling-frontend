# Intern Search Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the intern search page mobile-friendly with stacked layout, collapsible search form, and responsive inputs.

**Architecture:** The page has two CSS module files: `src/routes/_authenticated/intern/internSearch.module.css` (route-level, already has mobile-first column layout) and `src/components/InternSearch/internSearch.module.css` (component-level, still has original non-responsive styles). The route component (`search.tsx`) manages state and wraps the form in a `<Collapse>`. The form component (`InternSearchInput.tsx`) makes its inputs full-width on mobile.

**Tech Stack:** React, MUI (Collapse, Button, useMediaQuery, useTheme), CSS Modules with media queries at 900px.

---

### Task 1: Make search form inputs responsive

**Files:**
- Modify: `src/components/InternSearch/InternSearchInput.tsx:48` (remove fixed boxwidth)
- Modify: `src/components/InternSearch/internSearch.module.css` (add responsive styles)

- [ ] **Step 1: Replace fixed boxwidth with responsive approach in InternSearchInput.tsx**

Change the `boxwidth` constant and all `sx={{ width: boxwidth }}` usages. On mobile, inputs should be full-width. On desktop, keep 300px.

In `InternSearchInput.tsx`, replace:

```tsx
const boxwidth = 300;
```

with:

```tsx
const boxwidth = { xs: "100%", md: 300 };
```

This uses MUI's responsive `sx` syntax — `xs` applies below 900px (full-width), `md` applies at 900px+ (300px). The existing `sx={{ width: boxwidth }}` props on all Autocomplete, DatePicker, and Button components will automatically pick this up.

- [ ] **Step 2: Add date picker row layout**

In `InternSearchInput.tsx`, wrap the two DatePicker divs in a flex container so they sit side-by-side. Replace:

```tsx
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"NO"}
              localeText={
                nbNO.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <div className={styles.formTextField}>
                <DatePicker
                  label={"Dato fra"}
                  minDate={minDate}
                  value={dateFrom}
                  onChange={(newValue) => {
                    setDateFrom(newValue ?? undefined);
                    setDateFromChanged(true);
                  }}
                  format="DD/MM/YYYY"
                  sx={{ width: boxwidth }}
                />
              </div>
              <div className={styles.formTextField}>
                <DatePicker
                  label={"Dato til"}
                  maxDate={maxDate}
                  value={dateTo}
                  onChange={(newValue) => setDateTo(newValue ?? undefined)}
                  format="DD/MM/YYYY"
                  sx={{ width: boxwidth }}
                />
              </div>
            </LocalizationProvider>
```

with:

```tsx
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"NO"}
              localeText={
                nbNO.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <div className={styles.datePickerRow}>
                <div className={styles.formTextField}>
                  <DatePicker
                    label={"Dato fra"}
                    minDate={minDate}
                    value={dateFrom}
                    onChange={(newValue) => {
                      setDateFrom(newValue ?? undefined);
                      setDateFromChanged(true);
                    }}
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                  />
                </div>
                <div className={styles.formTextField}>
                  <DatePicker
                    label={"Dato til"}
                    maxDate={maxDate}
                    value={dateTo}
                    onChange={(newValue) => setDateTo(newValue ?? undefined)}
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                  />
                </div>
              </div>
            </LocalizationProvider>
```

Note: The date pickers use `width: "100%"` always because their parent `.datePickerRow` controls the layout (side-by-side with flex). Each picker fills half the row.

- [ ] **Step 3: Add datePickerRow style to component CSS**

In `src/components/InternSearch/internSearch.module.css`, add:

```css
.datePickerRow {
  display: flex;
  gap: 0.4rem;
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/InternSearch/InternSearchInput.tsx src/components/InternSearch/internSearch.module.css
git commit -m "feat: make intern search inputs responsive for mobile"
```

---

### Task 2: Add collapsible search form on mobile

**Files:**
- Modify: `src/routes/_authenticated/intern/search.tsx` (add Collapse, toggle state, useMediaQuery)
- Modify: `src/routes/_authenticated/intern/internSearch.module.css` (add filterToggle styles)

- [ ] **Step 1: Add collapse state and media query to route component**

In `src/routes/_authenticated/intern/search.tsx`, add imports at the top:

```tsx
import { Button, Collapse, useMediaQuery, useTheme } from "@mui/material";
import { FilterList } from "@mui/icons-material";
```

Inside `RouteComponent`, add state and media query:

```tsx
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("md"));
const [isFilterOpen, setIsFilterOpen] = useState(true);
```

- [ ] **Step 2: Modify handleSearchPhotos to auto-collapse on mobile**

Replace the existing `handleSearchPhotos` function:

```tsx
  const handleSearchPhotos = (photoSearch: PhotoSearch) => {
    setPage(1);
    setPhotoSearch(photoSearch);
  };
```

with:

```tsx
  const handleSearchPhotos = (photoSearch: PhotoSearch) => {
    setPage(1);
    setPhotoSearch(photoSearch);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };
```

- [ ] **Step 3: Update the JSX to wrap form in Collapse and add toggle button**

Replace the entire return block:

```tsx
  return (
    <div className={styles.internSearch}>
      <div className={styles.gridDivContainer}>
        <CustomDataGrid
          photos={photos}
          handlePageChange={handlePageChange}
          page={page}
          photosCount={photosCount}
          pageSize={pageSize}
        />
      </div>
      <InternSearchInput handleSearch={handleSearchPhotos} />
    </div>
  );
```

with:

```tsx
  return (
    <div className={styles.internSearch}>
      <div className={styles.filterSection}>
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            fullWidth
            className={styles.filterToggle}
          >
            {isFilterOpen ? "Skjul filter" : "Vis filter"}
          </Button>
        )}
        <Collapse in={isMobile ? isFilterOpen : true}>
          <InternSearchInput handleSearch={handleSearchPhotos} />
        </Collapse>
      </div>
      <div className={styles.gridDivContainer}>
        <CustomDataGrid
          photos={photos}
          handlePageChange={handlePageChange}
          page={page}
          photosCount={photosCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
```

Note: The DOM order now has the filter section first and results second. The `order: 2` on `.gridDivContainer` in the route CSS currently pushes results below the form — on desktop, this keeps results on the right side. Since we now have DOM order matching visual order, we should clean up the `order` property.

- [ ] **Step 4: Update route CSS to remove order and add filterSection styles**

In `src/routes/_authenticated/intern/internSearch.module.css`, replace:

```css
.gridDivContainer {
  flex: 1;
  min-width: 0;
  order: 2;
}
```

with:

```css
.gridDivContainer {
  flex: 1;
  min-width: 0;
}

.filterSection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

On desktop, the filter section needs a fixed width to preserve the sidebar layout. Add inside the existing `@media (min-width: 900px)` block for `.internSearch`:

```css
@media (min-width: 900px) {
  .internSearch {
    flex-direction: row;
  }

  .filterSection {
    flex-shrink: 0;
  }
}
```

- [ ] **Step 5: Add filterToggle style**

In `src/routes/_authenticated/intern/internSearch.module.css`, add:

```css
.filterToggle {
  margin-bottom: 0.5rem;
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/routes/_authenticated/intern/search.tsx src/routes/_authenticated/intern/internSearch.module.css
git commit -m "feat: add collapsible search form on mobile for intern search"
```

---

### Task 3: Final visual polish

**Files:**
- Modify: `src/components/InternSearch/internSearch.module.css` (mobile polish)
- Modify: `src/components/InternSearch/InternSearchInput.tsx` (Paper full-width on mobile)

- [ ] **Step 1: Make the Paper component in InternSearchInput stretch full-width on mobile**

In `src/components/InternSearch/InternSearchInput.tsx`, the `<Paper>` has inline `sx` styles. Update the `<Paper>` to be full-width:

Replace:

```tsx
      <Paper
        sx={{
          display: "flex",
          justifyContent: "left",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
          overflow: "hidden",
        }}
        component="ul"
      >
```

with:

```tsx
      <Paper
        sx={{
          display: "flex",
          justifyContent: "left",
          flexWrap: "wrap",
          listStyle: "none",
          p: { xs: 1, md: 0.5 },
          m: 0,
          overflow: "hidden",
          width: "100%",
        }}
        component="ul"
      >
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/InternSearch/InternSearchInput.tsx src/components/InternSearch/internSearch.module.css
git commit -m "feat: polish intern search form layout for mobile"
```
