# Phase 3 Features — Testing Plan

## Status Overview

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | Record Status field | **Partial** | API route, select component, grid column exist — verify DB column exists |
| 3.2 | Mandatory fields update | **Done** | Frontend + API validation in place |
| 3.3 | Boat service date extend to 1800 | **Not started** | No min date on date pickers |
| 3.4 | Vessel type active/inactive flag | **Done** | Status column with Active/Expired |
| 3.5 | NTS map sheet dropdown | **Done** | Autocomplete component with API |
| 3.6 | Export grid to CSV | **Not started** | No export functionality |
| 3.7 | Pending user request on dashboard | **Not started** | No pending count on dashboard |

---

## 3.1 Record Status field — GitHub Issue #167

**Files involved:**
- `api/routes/record-status-types-router.ts` — API endpoint for record status lookup
- `api/data/place-entities.ts` — `recordStatus` in PLACE_FIELDS
- `web/src/components/Sites/site-forms/RecordStatusTypesSelect.vue` — dropdown component
- `web/src/components/Sites/SiteCreate.vue` — record status on create form
- `web/src/components/Sites/SitesGrid/index.vue` — grid column + filter
- `api/services/place-service.ts` — CASE logic for recordStatusText

**Test steps:**
- [ ] **Verify DB column exists:** Check that `dbo.Place` has a `RecordStatus` column (run `SELECT TOP 1 RecordStatus FROM Place` in SSMS)
- [ ] **Verify lookup data exists:** Navigate to the app and open browser dev tools > Network tab, check that `GET /api/record-status-types` returns a list of status options
- [ ] Navigate to Sites > click "Add New Site"
- [ ] **Verify:** "Record Status" dropdown appears and is required
- [ ] Select a record status and fill other required fields, save
- [ ] **Verify:** The site is created with the correct record status
- [ ] Navigate to Sites grid
- [ ] **Verify:** "Record Status" column appears in the grid with text labels (not raw IDs)
- [ ] **Verify:** Record Status filter is available and filters the grid correctly
- [ ] Edit an existing site > Summary tab
- [ ] **Verify:** Record Status field appears and can be changed
- [ ] Save and verify the change persists

---

## 3.2 Mandatory fields update — GitHub Issue #179

**Files involved:**
- `web/src/components/Sites/SiteCreate.vue` — required rules on form fields
- `api/routes/place-router.ts` — POST validation (lines 174-191)

**Test steps:**
- [ ] Navigate to Sites > click "Add New Site"
- [ ] Click "Create" without filling in any fields
- [ ] **Verify:** Validation errors appear on all mandatory fields:
  - Primary name
  - NTS Map Sheet
  - Category
  - Community
  - Site Status
  - Record Status
  - Owner Consent
  - Floor Condition
  - Wall Condition
  - Door Condition
  - Roof Condition
  - Jurisdiction
  - Statute
  - Coordinate Determination
- [ ] Fill in all required fields and save
- [ ] **Verify:** Site is created successfully
- [ ] **Verify:** API returns 400 if required fields are missing (test via browser dev tools)

---

## 3.3 Boat service date extend to 1800 — GitHub Issue #177

**Status: NOT YET IMPLEMENTED**

**Files to change:**
- `web/src/components/Boats/BoatsComponents/Boat/BoatsForm.vue` — add min date to ConstructionDate, ServiceStart, ServiceEnd date pickers

**Test steps (after implementation):**
- [ ] Navigate to Boats > Add New Boat
- [ ] Open the Construction Date picker
- [ ] **Verify:** Years back to 1800 are selectable
- [ ] Select a date in the 1800s (e.g., 1850-01-01)
- [ ] **Verify:** The date is accepted and saved
- [ ] Repeat for Service Start and Service End date pickers
- [ ] Edit an existing boat — verify old dates still display correctly

---

## 3.4 Vessel type active/inactive flag — GitHub Issue #149

**Files involved:**
- `web/src/components/Administration/LookupTableManagement/VesselType/VesselType.vue` — admin grid with Status display
- Vessel type catalogs API

**Test steps:**
- [ ] Navigate to Administration > Vessel Types
- [ ] **Verify:** Each vessel type shows a Status column (Active or Expired)
- [ ] Edit a vessel type and change its status
- [ ] **Verify:** The status change persists after save
- [ ] Navigate to Boats > Add New Boat or Edit a Boat
- [ ] Open the Vessel Type dropdown
- [ ] **Verify:** Only "Active" vessel types appear in the dropdown (expired types are filtered out)
- [ ] **Verify:** If a boat already has an expired vessel type, it still displays correctly in view mode

---

## 3.5 NTS map sheet dropdown — GitHub Issue #105

**Files involved:**
- `web/src/components/Sites/site-forms/NtsMapSheetSelect.vue` — autocomplete component
- `api/routes/nts-map-sheets-router.ts` — API endpoint returning map sheet values
- `web/src/components/Sites/SiteCreate.vue` — uses autocomplete on create form

**Test steps:**
- [ ] Navigate to Sites > Add New Site
- [ ] Click the NTS Map Sheet field
- [ ] **Verify:** A searchable dropdown appears (not a plain text input)
- [ ] Type a partial map sheet number (e.g., "115")
- [ ] **Verify:** The dropdown filters to matching map sheets
- [ ] Select a map sheet from the dropdown
- [ ] **Verify:** The value is set correctly
- [ ] Save the site and verify the map sheet persists
- [ ] Edit an existing site with a map sheet value
- [ ] **Verify:** The current value is shown and can be changed via the dropdown
- [ ] Check the Location tab of a site edit form — **verify** it also uses the dropdown (not text input)

---

## 3.6 Export grid to CSV — GitHub Issue #97

**Status: NOT YET IMPLEMENTED**

**Expected fields in export:** YHSI ID, Name, NTS, Community, Category, Latitude, Longitude, Property Category

**Test steps (after implementation):**
- [ ] Navigate to Sites grid
- [ ] **Verify:** An "Export to CSV" button is visible
- [ ] Click Export with no filters applied
- [ ] **Verify:** A CSV file downloads with correct headers: YHSI ID, Name, NTS, Community, Category, Latitude, Longitude, Property Category
- [ ] **Verify:** All records are included (not just the current page)
- [ ] **Verify:** Data matches what's shown in the grid
- [ ] Apply filters to the grid, then export
- [ ] **Verify:** Only filtered records are exported
- [ ] Open the CSV in Excel — **verify** no encoding issues with special characters (accents, special place names)

---

## 3.7 Pending user request on dashboard — GitHub Issue #160

**Status: NOT YET IMPLEMENTED**

**Test steps (after implementation):**
- [ ] Log in as an Administrator
- [ ] Navigate to the Dashboard
- [ ] **Verify:** A "Pending User Requests" card/section appears
- [ ] **Verify:** It shows a count of pending registration requests
- [ ] If there are pending requests, **verify** clicking the card navigates to user management
- [ ] Approve or deny a pending request
- [ ] Return to Dashboard — **verify** the count updates
- [ ] Log in as a non-admin user
- [ ] **Verify:** The pending requests card is NOT visible (admin-only)

---

## Regression checks

- [ ] Sites grid loads and paginates correctly
- [ ] Sites create form submits successfully with all required fields
- [ ] Sites edit form saves changes correctly
- [ ] Boats create/edit forms work correctly
- [ ] All dropdowns (Category, Community, Designation, etc.) load their options
- [ ] No console errors on page load for Sites, Boats, or Dashboard pages
