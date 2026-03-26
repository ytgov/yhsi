# YHSI Upstream Issues Review

Review of open issues from [ytgov/yhsi](https://github.com/ytgov/yhsi/issues) with fix confidence estimates.

**Confidence scale:**
- **High (80-95%)** — Clear requirements, code path understood, straightforward fix
- **Medium (50-79%)** — Likely fixable but needs investigation or has some ambiguity
- **Low (20-49%)** — Significant unknowns, external dependencies, or needs stakeholder input
- **Needs Info (0-19%)** — Cannot proceed without clarification

---

## Bugs

### #215 — Burials: Add new Burial not redirecting
**Confidence: High (85%)**

The "Add Burial" button navigates to `/burials/new` but shows an error instead of the form. The `BurialCreateForm.vue` component exists and has a redirect back to `/burials` after save. Likely a routing misconfiguration or a missing/broken route definition in the Vue Router.

**Questions:** None — reproducible from description.

---

### #164 — YHSI: Site Change Request does not Save
**Confidence: Medium (65%)**

`SiteChangeRequest.vue` has a `save()` method that requires all field changes to be accepted/rejected before enabling the save button. The button is disabled with a tooltip if `hasUnconfirmedChanges` is true. Possible causes: the save action itself fails silently, or the button never enables due to a computed property bug.

**Questions:**
1. Does the save button remain greyed out, or does clicking it produce no response/error?
2. Is this for all change requests or only specific ones (e.g., ones with certain field types)?

---

### #163 — YHSI site security issues: Site Editor
**Confidence: Medium (70%)**

The `SITE_EDITOR` role exists in `user-roles.ts` and is used in route authorization. The edit button visibility depends on role-checking computed properties. Likely the frontend role check doesn't include `SITE_EDITOR` in the right places, or the `PlacePolicy` scope is too restrictive.

**Questions:**
1. Which specific sections/tabs does the Site Editor not get edit access to? (Summary, Location, all of them?)
2. Is the user confirmed to have the `Site Editor` role assigned (not `Place Editor` or another similar role)?

---

### #147 — Airplane Crash: Data Grid unable to scroll through pages
**Confidence: High (85%)**

`AirplaneCrashList.vue` uses `v-data-table` with server-side pagination. The `getDataFromApi()` method calculates page offset. There's already a comment in the code noting a potential filter offset bug. Likely a pagination calculation error or the page change event not triggering the data fetch.

**Questions:** None — code has a noted bug area already.

---

### #159 — AirCrash Print: Failed to load PDF
**Confidence: Medium (55%)**

PDF generation uses Puppeteer on the backend with Pug templates. The PDF is generated and downloaded but is corrupt/unreadable. Could be a Puppeteer rendering issue, malformed HTML in the Pug template, or encoding problems in the response stream.

**Questions:**
1. Does the downloaded file have a non-zero file size?
2. Is this on all airplane crash records or specific ones (e.g., ones with special characters or missing data)?

---

### #152 — AirplaneCrash: Print shows error
**Confidence: Medium (55%)**

Appears to be the same issue as #159 — printing an airplane crash record produces a corrupt PDF. These may be duplicates.

**Questions:**
1. Is this the same issue as #159? If so, one should be closed as duplicate.
2. If different, what distinguishes the two scenarios?

---

### #170 — Map: not showing YHSI sites for FN access
**Confidence: Low (35%)**

The map uses an ESRI ArcGIS WebMap with a hardcoded map ID. Site filtering by First Nation requires joining through `FirstNationAssociation` table. The map component doesn't show explicit FN filtering logic — it may be handled in the ArcGIS service layer definitions or in the API query. Could also be an issue with how user access scoping works for FN-based permissions.

**Questions (commented on GitHub):**
1. Which specific role/permission configuration is "access set by First Nation" referring to?
2. Is the issue in the map query, the API filter, or the ArcGIS layer definition?
3. Example user/role setup that reproduces this?

---

### #88 — Interpretive Sites: New Site Form Issues
**Confidence: Medium (50%)**

Multiple sub-issues:
- Site name writes to Maintained field — likely a form field binding error (field model pointing to wrong property)
- Unable to add maintainers — need to check the maintainer sub-form
- Mapsheet pulling from wrong source — MapLoader.vue has hardcoded test data `['test1', 'test2']`
- Inspection add error — likely an API/validation error
- No cancel/delete functionality
- No save notification + form clears without feedback
- Unable to add asset/action/inspection

**Questions:**
1. How many of these sub-issues have been partially fixed since this was filed (2023)?
2. Should this be broken into separate issues for tracking?

---

## Feature Requests

### #179 — YHSI create new: mandatory fields update
**Confidence: High (90%)**

Make only these fields mandatory on create: Primary Name, NTS Map Sheet, Site Status, Latitude, Longitude, Record Status (new). This is a straightforward validation change in the create form and API endpoint.

**Questions:**
1. "Record Status (new)" — does this refer to the new field from #167, or the existing `SiteStatus`? If #167, that needs to be implemented first.

---

### #177 — Boat Service date start earlier
**Confidence: High (90%)**

`ServiceStart` and `ServiceEnd` are `dateTime` fields in the DB (migration 049). The date picker in the UI likely restricts to ~100 years back. Fix is to extend the date picker's min date to 1800. The note about using `01/01/year` when only the year is known may need a UI hint or helper.

**Questions:** None — clear requirement.

---

### #167 — YHSI: Add new field (Record Status)
**Confidence: High (85%)**

Add a "Record Status" dropdown (Active/Archived) to the top of the YHSI form, show it on the grid, default to "Active" on create, default grid filter to show Active only. Requires: new DB column (migration), API updates, frontend form field, grid column + filter.

**Questions:**
1. Should this be a new column on the `Place` table directly, or a new lookup table?
2. Should "Archived" records be completely hidden from non-admin users, or just filtered out by default?

---

### #169 — YHSI form updates
**Confidence: High (90%)**

Three clear sub-tasks:
- Historical Pattern button label missing in edit state — UI fix in the component
- "Border number" → "Borden number" — already correct in current code (`Location.vue:166` shows "Borden number"), may already be fixed
- Lat/long validation (numbers only, no text/spaces, longitude negative, latitude positive, no digit limit) — add validation rules to the form fields

**Questions:** None — clear requirements.

---

### #176 — Update db spelling of FN names
**Confidence: Needs Info (15%)**

No list of which names need correction or what the correct spellings are. This requires domain knowledge about First Nation naming conventions and proper Unicode characters.

**Questions (commented on GitHub):**
1. Which specific names need correction and in which tables?
2. Is there a reference list with correct spellings?
3. One-time migration or also update input forms for special character support?

---

### #174 — Admin Screen: Contributing Resource
**Confidence: Medium (75%)**

Create an admin CRUD screen for Contributing Resource lookup table. The pattern is well-established in the codebase (many admin lookup screens exist). Need to confirm the table exists and understand its schema.

**Questions:**
1. Does the `ContributingResource` table already exist in the DB, or does it need to be created?
2. What fields should the admin screen expose (just name/description, or additional fields)?

---

### #173 — Admin Screen: Community
**Confidence: Medium (75%)**

Same pattern as #174. The `Community` table exists in the schema. Need to create an admin CRUD interface following the existing admin screen pattern.

**Questions:**
1. Should this allow adding/editing/deleting communities, or just viewing and editing names?
2. Are there any communities that should be protected from deletion (referenced by existing records)?

---

### #172 — Admin Screen: Photo owner
**Confidence: Medium (75%)**

Same admin CRUD pattern. Photo owner data is used in the photo batch and photo library workflows.

**Questions:**
1. What fields does the Photo Owner entity have beyond name?
2. Should deletion be restricted if the owner is referenced by existing photos?

---

### #162 — Photo Batch Updates
**Confidence: Medium (55%)**

Four sub-features:
1. Associate photo batch with a record from any module (YHSI site, boat, airplane crash, etc.)
2. Multi-file upload (currently one-at-a-time)
3. Delete uploaded photos from batch
4. Add photo owner directly from the batch form

This is a significant feature enhancement touching multiple components and API endpoints.

**Questions:**
1. For record association: should a batch be linkable to multiple records, or exactly one?
2. For multi-upload: any file size/count limits?
3. For inline photo owner creation: should this use a modal dialog or inline form?

---

### #160 — Add Pending User request to dashboard
**Confidence: High (80%)**

Add a card to the admin dashboard showing pending user registration requests. Need to check if there's an existing pending users API endpoint.

**Questions:**
1. Which dashboard — the system admin landing page?
2. Should the card show a count, a list of names, or both?
3. Should it link to a user management page for approving requests?

---

### #149 — Boats: ability to set vessel type as inactive
**Confidence: High (85%)**

Add an active/inactive flag to the vessel type lookup table, and filter inactive types from dropdowns while preserving them for existing records. Standard pattern.

**Questions:** None — clear requirement.

---

### #143 — Security: YRHP
**Confidence: Low (40%)**

Create a YRHP Viewer role. The `YRHP_EDITOR` role already exists in the system. The YRHP schema/tables appear to be in-progress (commented out in migrations). Implementing the viewer role is straightforward, but the YRHP module itself may not be complete enough to scope properly.

**Questions (commented on GitHub):**
1. What pages/routes should the YRHP Viewer have access to?
2. "Hide module completely" — hide nav item and block API access, or just hide nav?
3. Is the YRHP module implemented enough to add role-based access to?

---

### #105 — YHSI: NTS drop down
**Confidence: High (80%)**

Replace the free-text NTS Map Sheet field with a dropdown populated from the same data source Places uses. The `NtsMapSheetsFilter.vue` component already exists for filtering, so the data source is available.

**Questions:**
1. Should this be a searchable/autocomplete dropdown (there are many NTS map sheets)?

---

### #96 — YHSI: Show and search secondary names
**Confidence: Medium (70%)**

Show comma-separated secondary names on the YHSI grid and include them in the global search. Secondary names are stored in a `names` array on the Place model. Requires modifying the grid query to join/aggregate secondary names and updating the search logic.

**Questions:**
1. Should the grid show all secondary names or just the first N?
2. For search, should partial matches on secondary names work the same as primary name matches?

---

### #109 — YHSI: Save search/filters
**Confidence: Medium (50%)**

Implement saved search/filter functionality. This is a full feature requiring UI design decisions and a persistence mechanism.

**Questions:**
1. Persist in database (cross-device) or browser local storage (simpler)?
2. Named/managed multiple saved filters, or just "last used"?
3. Shareable between users or private?
4. Which modules — just YHSI Sites or all grids?

---

### #108 — YHSI: Select from grid and export
**Confidence: Medium (50%)**

Select multiple sites from the grid and export as a combined PDF (zip or single document). Requires: multi-select UI on the grid, batch PDF generation endpoint, and file packaging.

**Questions:**
1. Max number of records for batch export?
2. Preference for zip of individual PDFs vs. single combined PDF?

---

### #97 — YHSI: Export grid to csv
**Confidence: High (80%)**

Export grid data to CSV with specific fields: YHSI ID, Site name, NTS Map, Community, Site Category, Lat, Long, Category of Property. Straightforward data export feature.

**Questions:**
1. Should this export the current filtered view or all records?
2. Any specific CSV formatting requirements (encoding, delimiter)?

---

## Standardization / Template Issues

These are a batch of related issues about updating modules to match the current YG (Yukon Government) template.

### #127 — Standardize: Confirm YG Template Updated (Sites, Photos, Places)
### #128 — Standardize: Airplane crash module
### #129 — Standardize: Boats
### #130 — Standardize: Burials
### #131 — Standardize: Interpretive Sites
### #132 — Standardize: People
### #133 — Standardize: Admin

**Confidence for all: Low (25%)**

All say "Based on the newest YG template update forms to match" with no further detail. #130 (Burials) has a change tracking/approval design document in its body that appears to be copy-pasted from a different issue.

**Questions (commented on #130):**
1. Where is the "newest YG template"? Is there a Figma, PDF, or reference URL?
2. What specific aspects need standardization — layout, spacing, colors, component usage, navigation?
3. Is #130's body (change tracking design) intentional or a copy-paste error?

---

### #136 — Update: Add sub nav if fits template
**Confidence: Low (30%)**

Vague description: "Photo batches - Part of Photos, Site change request part of Sites."

**Questions (commented on GitHub):**
1. Does this mean adding sub-menu items (Photo Batches under Photos, Site Change Requests under Sites)?
2. Which YG template is the reference?
3. Any other modules that need sub-navigation?

---

## Widget Issues

### #112 — Location Widget: Reusable component
### #113 — Location Widget update: Airplane Crash
### #114 — Location Widget update: Interpretive Sites
### #115 — Location Widget update: Places
### #116 — Location Widget update: YHSI Sites

**Confidence: Medium (60%)**

`MapLoader.vue` exists as the location widget with coordinate system support (DD, UTM, DMS). These issues ask to ensure it's properly implemented as a reusable component across all modules. The component exists but may not be integrated everywhere.

**Questions:**
1. Is the `MapLoader.vue` component the current "location widget," or is there a newer version?
2. Which modules currently have it integrated vs. which don't?

---

### #110 — Location Widget: Fix coordinate system selector
**Confidence: Medium (65%)**

Specific sub-tasks:
- Add UTM zones 7, 9, 10
- Fix "WSG" → "WGS" typo
- Make NAD83 and NAD83 CSRS work
- Fix negative values appearing in DMS minutes

**Questions:**
1. For NAD83/CSRS — what is the expected conversion behavior? Are there reference coordinates to test against?

---

### #111 — Location Widget: Update map to ensure centred in middle
**Confidence: Medium (55%)**

Body still has template placeholder text. Mentions possibly switching from Leaflet to ESRI JS API.

**Questions:**
1. Has a decision been made on Leaflet vs. ESRI JS API?
2. What is the "MJ map on YHSI site" that should be referenced?

---

### #119 — Photo Widget update: Interpretive Sites
### #120 — Photo Widget update: Burials
### #121 — Photo Widget update: Boats
### #124 — Photo Widget: Associated Record Links work for all modules

**Confidence: Medium (65%)**

Ensure the reusable photo widget is properly integrated in each module and that associated record links work. Pattern is established; need to verify current integration state per module.

**Questions:** None — these are integration verification tasks.

---

## Print Issues

### #125 — Print Record Update All Modules
### #126 — Print Grid: All Modules

**Confidence: Medium (50%)**

Extend the YHSI Sites print solution to all other modules. Requires creating Pug templates and PDF generation endpoints for each module that doesn't have them yet.

**Questions:**
1. Is the YHSI Sites print solution (the reference implementation) working correctly?
2. Which modules already have print functionality that just needs updating vs. which need it built from scratch?

---

## Summary Table

| # | Issue | Confidence | Blocker |
|---|-------|-----------|---------|
| 215 | Burials: Add new not redirecting | High (85%) | — |
| 179 | Mandatory fields update | High (90%) | Depends on #167 |
| 177 | Boat service date earlier | High (90%) | — |
| 169 | YHSI form updates | High (90%) | — |
| 167 | Add Record Status field | High (85%) | — |
| 149 | Vessel type active/inactive | High (85%) | — |
| 147 | AirCrash pagination | High (85%) | — |
| 97 | Export grid to CSV | High (80%) | — |
| 160 | Pending user on dashboard | High (80%) | — |
| 105 | NTS dropdown | High (80%) | — |
| 174 | Admin: Contributing Resource | Medium (75%) | — |
| 173 | Admin: Community | Medium (75%) | — |
| 172 | Admin: Photo owner | Medium (75%) | — |
| 163 | Site Editor permissions | Medium (70%) | Needs testing |
| 96 | Show/search secondary names | Medium (70%) | — |
| 164 | Change Request save | Medium (65%) | Needs repro |
| 110 | Coordinate system selector | Medium (65%) | — |
| 119-124 | Photo widget updates | Medium (65%) | — |
| 112-116 | Location widget updates | Medium (60%) | — |
| 159 | AirCrash print PDF | Medium (55%) | — |
| 152 | AirCrash print error | Medium (55%) | Likely dup of #159 |
| 162 | Photo batch updates | Medium (55%) | — |
| 111 | Map centre widget | Medium (55%) | — |
| 109 | Save search/filters | Medium (50%) | Needs design decisions |
| 108 | Select and export | Medium (50%) | — |
| 125-126 | Print all modules | Medium (50%) | — |
| 88 | Interp Sites form issues | Medium (50%) | Many sub-issues |
| 143 | Security: YRHP | Low (40%) | YRHP module incomplete |
| 170 | Map FN access | Low (35%) | External ArcGIS dependency |
| 136 | Sub nav template | Low (30%) | No template reference |
| 127-133 | Standardize modules (7 issues) | Low (25%) | No template reference |
| 176 | FN name spelling | Needs Info (15%) | No correction list |
