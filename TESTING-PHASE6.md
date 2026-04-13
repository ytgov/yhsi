# Phase 6 — Medium-Effort Features Testing Plan

## Status Overview

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | Photo batch updates | **Partial** | Multi-upload ✓ (already done), delete ✓ (already done), record association ✓ (process-batch already done), **inline owner creation** ✓ **Done** |
| 6.2 | Location widget: reusable component | **Partial** | MapLoader used in Sites (via map-dialog), InterpretiveSites ✓, AirCrash ✓. Boats/Burials have no lat/long columns — not applicable without schema changes |
| 6.3 | Location widget: map centering | **Not started** | Needs decision on Leaflet vs ESRI JS API — blocked on stakeholder input |
| 6.4 | Print record: all modules | **Done** (pre-existing) | Backend print routes exist for all modules (boats, burials, people, aircrash, interpretive-sites, places). Frontend print buttons exist for all modules. |
| 6.5 | Print grid: all modules | **Done** (pre-existing) | Grid PDF endpoints exist for all modules |
| 6.6 | Select from grid and export | **Done** | Sites grid: checkboxes added, "Export Selected" button exports only checked rows to CSV |
| 6.7 | Save search/filters | **Not started** | Needs stakeholder decision on persistence scope and sharing |
| 6.8 | Interpretive Sites form issues | **Partial** | Fixed double-navigation after save; removed meaningless `v-if="true"` on MapLoader. The 7 sub-issues from #88 not fully enumerated — further review needed |

---

## Key Changes Made

### 6.6 — Sites Grid Multi-select Export

**File:** `web/src/components/Sites/SitesGrid/index.vue`

- Added `show-select` and `v-model="selectedItems"` to `v-data-table`
- Added `selectedItems: []` to component data
- Added **"Export Selected (N)"** button alongside existing "Export to CSV"
  - Button is disabled when no rows are checked
  - Shows current selection count in the label
  - Exports only the selected rows using in-memory data (no extra API call)
  - Output file: `yhsi-sites-selected-YYYY-MM-DD.csv`
  - Same column format as full export: YHSI ID, Name, Secondary Names, NTS Map Sheet, Community, Category, Record Status, Site Status, Latitude, Longitude

### 6.1 — Photo Inline Owner Creation

**File:** `web/src/components/MainPhotos/PhotosComponents/Photo.vue`

- Added `mdi-plus-circle` icon button next to the Owner dropdown (visible in edit/create mode only)
- Clicking "+" opens a dialog with a single "Owner Name" text field
- On submit: POSTs to `POST /api/static/photo-owner` with `{ name }`
- On success: new owner is inserted into the sorted dropdown and auto-selected
- Supports Enter key to submit from the name field
- Loading spinner on Create button while request is in-flight

### 6.8 — InterpretiveSites Form Fixes

**File:** `web/src/components/InterpretiveSites/InterpetiveSiteComponents/Form.vue`

- Removed `this.$router.go()` after `this.$router.push({ name: 'InterpretiveSitesGrid' })` in `saveChanges()`. The grid's `mounted()` already calls `getDataFromApi()` so the redundant reload caused a race condition.
- Removed meaningless `v-if="true"` on `<MapLoader>` in the Location panel.

---

## Test Steps

### 6.6 — Sites Grid Multi-select

- [ ] Navigate to **Sites** grid
- [ ] **Verify:** A checkbox column appears as the first column in the table
- [ ] Check 3–5 rows
- [ ] **Verify:** "Export Selected (N)" button becomes active and shows correct count
- [ ] Click "Export Selected" — **verify:** CSV downloads with only the checked rows
- [ ] **Verify:** Clicking "Export to CSV" still exports all search results (unchanged)
- [ ] **Verify:** Clicking a row still navigates to the site detail page (not blocked by checkboxes)
- [ ] Uncheck all rows — **verify:** "Export Selected (0)" button becomes disabled

### 6.1 — Inline Owner Creation

- [ ] Open any photo for editing (e.g., in a photo batch: `/photobatches/attributes/:id`)
- [ ] Expand the **Photo** accordion section
- [ ] **Verify:** A `+` icon button appears to the right of the Owner dropdown
- [ ] Click `+` — **verify:** dialog opens with "Owner Name" text field
- [ ] Type a new owner name and press Enter or click Create
- [ ] **Verify:** Dialog closes, new owner appears in the dropdown and is selected
- [ ] Save the record — **verify:** owner is saved correctly
- [ ] Re-open the record — **verify:** owner name persists
- [ ] **Verify:** In view mode, the `+` button is hidden

### 6.8 — InterpretiveSites Save Flow

- [ ] Navigate to an existing Interpretive Site and click Edit
- [ ] Make a minor change (e.g., update the Notes field)
- [ ] Click Save
- [ ] **Verify:** Navigates to the Interpretive Sites grid (not a blank page or error)
- [ ] **Verify:** The grid loads fresh data showing the updated record (no double-reload)
- [ ] **Verify:** No console errors about duplicate navigation

---

## Regression Checks

- [ ] Sites grid loads and search/filter still work
- [ ] "Export to CSV" (full export) still works unchanged
- [ ] Photo form in view mode shows no `+` button (owner select is readonly)
- [ ] Interpretive Sites create new record still redirects to the new site's view page
- [ ] Print buttons on all modules (Boats, Burials, People, AirCrash, Interpretive Sites) still work

---

## Not Implemented / Deferred

| Item | Reason |
|------|--------|
| 6.2 Location widget (Boats/Burials) | No lat/long columns in those tables — would require schema changes |
| 6.3 Location map centering | Needs stakeholder decision on map library approach |
| 6.7 Save search/filters | Needs stakeholder decision on persistence scope |
| 6.8 Remaining #88 sub-issues | Need GitHub access to enumerate remaining sub-issues |
