# Phase 4 Features — Testing Plan

## Status Overview

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | Admin: Contributing Resource | **Not started** | Types are hardcoded in model — requires DB table before CRUD UI is possible |
| 4.2 | Admin: Community | **Done** | Component + router existed; AdminDashboard link URL fixed |
| 4.3 | Admin: Photo Owner | **Done** | Component + router existed; AdminDashboard link URL fixed |
| 4.4 | Show/search secondary names | **Done** | Secondary names column in grid + CSV; SQL STRING_AGG aggregate in doSearch |
| 4.5 | Coordinate system selector fixes | **Done** | WSG→WGS typo fixed; UTM label fixed; DMS direction fields are now selects (N/S, E/W) |
| 4.6 | Photo widget: Boats | **Already done** | GenericRecordPhotosCard present in BoatsForm.vue |
| 4.7 | Photo widget: Burials | **Already done** | GenericRecordPhotosCard present in BurialsComponents/Form.vue |
| 4.8 | Photo widget: Interpretive Sites | **Already done** | GenericRecordPhotosCard present in InterpetiveSiteComponents/Form.vue |
| 4.9 | Photo widget: Associated record links | **Already done** | Link-to-photo-page navigation exists in GenericRecordPhotosCard |

---

## 4.1 Admin: Contributing Resource — GitHub Issue #174

**Status: NOT YET IMPLEMENTED**

The contributing resource types are currently a hardcoded enum in `api/models/contributing-resource-types.ts`. A DB table (`ContributingResourceType`) must be created before a CRUD admin screen is possible. The AdminDashboard menu item exists but has an empty URL.

**What already exists:**
- `api/routes/contributing-resource-types-router.ts` — GET returns hardcoded types
- `web/src/apis/contributing-resource-types-api.js` — frontend API client
- `web/src/components/Sites/site-forms/ContributingResourceTypesSelect.vue` — used in site forms

**Steps to implement (after DB table is created):**
1. Create `ContributingResource` admin Grid component (`web/src/components/Administration/LookupTableManagement/ContributingResource/`)
2. Create `AddDialog.vue` and `EditDialog.vue` following the VesselType pattern
3. Add `/admin/contributing-resources` route to `web/src/router.js`
4. Update `AdminDashboard.vue` `url: ''` to `/admin/contributing-resources`
5. Update the API router to support POST/PUT/DELETE against the DB table

**Test steps (after implementation):**
- [ ] Navigate to Administration → look for "Contributing Resources" in the lookup tables list
- [ ] **Verify:** Clicking "Contributing Resources" navigates to the admin grid
- [ ] **Verify:** All 5 types appear (Archaeological, Building, Collection, Landscapes, Structure)
- [ ] Add a new contributing resource type
- [ ] **Verify:** It appears in the grid and is available in the site forms dropdown
- [ ] Edit an existing type name
- [ ] **Verify:** The change is reflected in site forms
- [ ] **Verify:** Deleting a type prompts for confirmation

---

## 4.2 Admin: Community — GitHub Issue #173

**Files involved:**
- `web/src/components/Administration/AdminDashboard.vue` — URL fixed from `''` to `/admin/community`
- `web/src/components/Administration/LookupTableManagement/Community/CommunityGrid.vue` — grid
- `web/src/components/Administration/LookupTableManagement/Community/AddDialog.vue` — add form
- `web/src/components/Administration/LookupTableManagement/Community/EditDialog.vue` — edit form

**Test steps:**
- [ ] Navigate to Administration dashboard
- [ ] **Verify:** "Community" item in the Lookup Table Management section is clickable
- [ ] Click it — **Verify:** navigates to `/admin/community`
- [ ] **Verify:** Grid shows all communities with Name and Name (French) columns
- [ ] Click "Add" button — **Verify:** dialog opens
- [ ] Fill in Name and Name (French), save
- [ ] **Verify:** New community appears in the grid
- [ ] Click a community to edit — **Verify:** dialog opens pre-populated
- [ ] Update the French name — **Verify:** change persists after save
- [ ] **Verify:** New community appears in site forms (Community dropdown)

---

## 4.3 Admin: Photo Owner — GitHub Issue #172

**Files involved:**
- `web/src/components/Administration/AdminDashboard.vue` — URL fixed from `''` to `/admin/photo-owner`
- `web/src/components/Administration/LookupTableManagement/PhotoOwner/PhotoOwnerGrid.vue`
- `web/src/components/Administration/LookupTableManagement/PhotoOwner/AddDialog.vue`
- `web/src/components/Administration/LookupTableManagement/PhotoOwner/EditDialog.vue`

**Test steps:**
- [ ] Navigate to Administration dashboard
- [ ] **Verify:** "Photos - Owner" item is clickable
- [ ] Click it — **Verify:** navigates to `/admin/photo-owner`
- [ ] **Verify:** Grid loads with photo owner records
- [ ] Add a new photo owner — **Verify:** fields include name, contact person, email, phone, address
- [ ] **Verify:** New owner appears in the grid
- [ ] Edit an existing owner — **Verify:** changes persist
- [ ] **Verify:** New owner appears in the Owner dropdown when editing a photo

---

## 4.4 Show/search secondary names — GitHub Issue #96

**Files involved:**
- `api/services/place-service.ts` — added `STRING_AGG` subquery to `doSearch` select
- `web/src/components/Sites/SitesGrid/index.vue` — added "Secondary Names" column + CSV field

**Test steps:**
- [ ] Navigate to Sites grid
- [ ] **Verify:** "Secondary Names" column appears in the grid
- [ ] For a site with secondary names, **verify:** the column shows them comma-separated
- [ ] For a site with no secondary names, **verify:** the column is empty (not an error)
- [ ] Search by a secondary name (e.g., a known alias for a site)
- [ ] **Verify:** The site appears in results even though the search term is only in a secondary name
- [ ] Click "Export to CSV"
- [ ] **Verify:** The CSV includes a "Secondary Names" column with the aggregated names

---

## 4.5 Coordinate system selector fixes — GitHub Issue #110

**Files involved:**
- `web/src/components/MapLoader.vue` — WSG→WGS typo, UTM label, DMS direction dropdowns

**Test steps:**
- [ ] Navigate to Sites > Maps view (or any location with the map coordinate input)
- [ ] Open the coordinate system / projection dropdown
- [ ] **Verify:** The projection shows "WGS 84" (not "WSG 84")
- [ ] Select "UTM" from the coordinate system dropdown
- [ ] **Verify:** The label reads "UTM" (not "UTM Zone 8")
- [ ] Enter Easting, Northing, Zone Number and Zone Letter values
- [ ] **Verify:** Coordinates convert correctly to decimal degrees
- [ ] Select "Degrees, Minutes, Seconds" from the coordinate system dropdown
- [ ] **Verify:** The Latitude direction field is a dropdown with options N and S (not a text box)
- [ ] **Verify:** The Longitude direction field is a dropdown with options E and W (not a text box)
- [ ] Select "S" for latitude direction — **Verify:** the converted decimal degrees is negative
- [ ] Select "W" for longitude direction — **Verify:** the converted decimal degrees is negative
- [ ] Switch back to Decimal Degrees — **Verify:** the values are still correct

---

## 4.6 Photo widget: Boats — GitHub Issue #121

**Status: Already implemented**

**Test steps:**
- [ ] Navigate to Boats > view or edit an existing boat
- [ ] **Verify:** Photo section appears (GenericRecordPhotosCard)
- [ ] **Verify:** Existing photos load and display
- [ ] In edit mode, **verify:** "Add Photo" button is available
- [ ] Add a photo and save — **verify:** photo appears in the boat's photo section
- [ ] Click a photo thumbnail — **verify:** it opens the full photo view

---

## 4.7 Photo widget: Burials — GitHub Issue #120

**Status: Already implemented**

**Test steps:**
- [ ] Navigate to Burials > view or edit an existing burial record
- [ ] **Verify:** Photo section appears
- [ ] **Verify:** Existing photos load
- [ ] In edit mode, **verify:** "Add Photo" button is available
- [ ] Add a photo — **verify:** it appears and is associated with the burial record

---

## 4.8 Photo widget: Interpretive Sites — GitHub Issue #119

**Status: Already implemented**

**Test steps:**
- [ ] Navigate to Interpretive Sites > view or edit a site
- [ ] **Verify:** Photo section appears
- [ ] **Verify:** Existing photos load
- [ ] In edit mode, **verify:** "Add Photo" button is available
- [ ] Add a photo — **verify:** it appears and is associated with the interpretive site

---

## 4.9 Photo widget: Associated record links — GitHub Issue #124

**Status: Already implemented**

**Test steps:**
- [ ] Navigate to any record with photos (Sites, Boats, Burials, Interpretive Sites)
- [ ] **Verify:** Photo widget shows photos associated with that record
- [ ] Click a photo — **verify:** the photo detail page opens
- [ ] On the photo detail page, **verify:** there is a link back to the associated record
- [ ] Navigate to Photos module directly, find a photo linked to a site
- [ ] **Verify:** The linked record (site/boat/burial/interpretive site) is shown and clickable

---

## Regression checks

- [ ] Sites grid loads with Secondary Names column — no console errors
- [ ] Sites search still works (including searching by secondary names)
- [ ] CSV export includes Secondary Names column with correct data
- [ ] Administration dashboard — Community and Photo Owner links navigate correctly
- [ ] Map coordinate input: WGS 84 label is correct in projection dropdown
- [ ] DMS direction fields show dropdowns (N/S for lat, E/W for lng)
- [ ] Coordinate conversion from DMS to decimal degrees works for southern/western coordinates
- [ ] All photo widgets (Boats, Burials, Interpretive Sites) still load without errors
