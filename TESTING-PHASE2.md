# Phase 2 Bug Fixes — Testing Plan

## 2.1 Burials: Add new not redirecting — GitHub Issue #215

**Files changed:**
- `web/src/components/Burials/BurialCreateForm.vue` — capture POST response, redirect to new record
- `web/src/router.js` — fix view route param `:name` to `:id`

**Test steps:**
- [ ] Navigate to Burials > click "Add New"
- [ ] Fill in required fields and click Save
- [ ] **Verify:** App redirects to `/burials/view/<BurialID>` showing the new record (not back to the list)
- [ ] **Verify:** The view page loads the burial data correctly
- [ ] Navigate to an existing burial from the list (click a row) — confirm viewing still works
- [ ] Navigate to edit an existing burial — confirm editing still works
- [ ] If the API returns an error on create, verify it redirects to `/burials` (graceful fallback)

---

## 2.2 AirCrash pagination broken — GitHub Issue #147

**Files changed:**
- `web/src/modules/AirplaneCrashes/views/AirplaneCrashList.vue` — send 1-indexed page, remove stale comment
- `api/services/aircrash-service.ts` — add separate COUNT query for total records

**Test steps:**
- [ ] Navigate to Airplane Crashes list
- [ ] **Verify:** The total record count shown in the pagination footer matches the actual number of records (not just the current page size)
- [ ] Click to page 2 — **verify** different records are shown (not the same as page 1)
- [ ] Click to page 3 and back to page 1 — **verify** correct records on each page
- [ ] Change items-per-page dropdown (e.g., 10, 25, 50) — **verify** pagination recalculates correctly
- [ ] Apply a filter (e.g., injuries = 3) — **verify** only matching records appear and the count updates
- [ ] Apply a filter and paginate — **verify** pagination works with filters applied
- [ ] Sort by a column and paginate — **verify** sort order persists across pages

---

## 2.3 YHSI form updates — GitHub Issue #169

### 2.3a Borden typo
**Status:** Already fixed in a prior commit. No changes made.
- [ ] Confirm the field label reads "Borden number" (not "Border number") on the site Location tab

### 2.3b Lat/long validation
**Files changed:**
- `web/src/components/Sites/site-forms/Location.vue` — added validation rules
- `web/src/components/Sites/SiteChangeRequest.vue` — added validation rules

**Test steps:**
- [ ] Edit a site > Location tab
- [ ] Enter text in Latitude field (e.g., "abc") — **verify** validation error appears
- [ ] Enter a number with spaces (e.g., "60 .5") — **verify** validation error appears
- [ ] Enter latitude > 90 (e.g., "91") — **verify** validation error
- [ ] Enter latitude < -90 (e.g., "-91") — **verify** validation error
- [ ] Enter valid latitude (e.g., "60.7212") — **verify** no error
- [ ] Enter text in Longitude field — **verify** validation error appears
- [ ] Enter longitude > 180 or < -180 — **verify** validation error
- [ ] Enter valid longitude (e.g., "-135.0568") — **verify** no error
- [ ] Leave both fields empty — **verify** no error (fields are optional)
- [ ] Check the same validation on the Site Change Request form

### 2.3c Historical Pattern button label
**Status:** Investigated — the "Add New Historical Pattern" button is already gated behind `v-if="isEditing"` and appears correctly in edit mode. The HistoricalPatternTypesSelect dropdown also has a `:readonly` check. If the issue persists, it may be a different UI state issue.
- [ ] Edit a site > Summary tab > scroll to Historical Patterns
- [ ] **Verify** the "Add New Historical Pattern" button appears in edit mode
- [ ] **Verify** the button is hidden in view mode

---

## 2.4 Site Editor can't edit — GitHub Issue #163

**Files changed:**
- `web/src/store/places.js` — added `SITE_EDITOR` to the direct save role check
- `api/routes/place-router.ts` — added `SITE_EDITOR` to the PATCH `/:id` authorization

**Test steps:**
- [ ] Log in as a user with **Site Editor** role (not Site Admin or Administrator)
- [ ] Navigate to a site and click Edit
- [ ] Make a change and click Save
- [ ] **Verify:** The save completes successfully (no error, data persists)
- [ ] **Verify:** The save goes through as a direct edit (not a change request)
- [ ] Log in as **Site Admin** — **verify** editing still works as before
- [ ] Log in as **Administrator** — **verify** editing still works as before
- [ ] Log in as **Site Viewer** — **verify** they cannot edit (save should create a change request or be blocked)

---

## 2.5 Site Change Request save broken — GitHub Issue #164

**Files changed:**
- `api/services/place-edit-service.ts` — added `.returning('*')` to INSERT so it returns the created record

**Test steps:**
- [ ] Log in as a user who submits change requests (e.g., Site Viewer with edit access, or a role that triggers the change request path)
- [ ] Edit a site and save — **verify** the change request is created successfully
- [ ] **Verify:** The UI receives the PlaceEdit object back (not just a number)
- [ ] Navigate to Site Change Requests
- [ ] **Verify:** The new change request appears in the list
- [ ] Open the change request, review and accept changes, click Save
- [ ] **Verify:** The changes are applied to the actual Place record
- [ ] **Verify:** The change request is deleted after approval
- [ ] **Verify:** Redirect goes to `/sites-change-requests` after save

---

## 2.6 AirCrash print/PDF corrupt — GitHub Issues #159 / #152

**Files changed:**
- `api/templates/aircrashes/aircrashView.pug` — fixed wrong field references in Crash Details section, fixed "Longitude Maker/Model" label, fixed "Crash Sources" label
- `api/templates/aircrashes/aircrashGrid.pug` — fixed `soulsonBoard` case to `soulsonboard`

**Test steps:**

### Individual record PDF:
- [ ] Navigate to an AirCrash record with known data
- [ ] Click Print/PDF
- [ ] **Verify:** "Crash Details" section shows correct data:
  - "Remains on site" shows the actual remains field (not YACSI number)
  - "Extent of remains on site" shows extent data (not aircraft type)
  - "Other location of remains" shows location data (not crash date)
- [ ] **Verify:** "Location Details" section shows "Longitude:" (not "Longitude Maker/Model:")
- [ ] **Verify:** "Crash Sources" section shows "Significance of aircraft:" (not "Remains on site:")
- [ ] **Verify:** All other fields (YACSI Number, Crash Date, Pilot, etc.) still display correctly

### Grid PDF:
- [ ] Navigate to Airplane Crashes list
- [ ] Click Print Grid / Export PDF
- [ ] **Verify:** The "Souls on Board" column shows actual values (not blank/undefined)
- [ ] **Verify:** All other columns display correctly

---

## Regression checks

- [ ] All other modules (Places, Photos, Boats, People, Interpretive Sites) still load and function normally
- [ ] No console errors on page load for any module
- [ ] Login/logout flow works correctly
