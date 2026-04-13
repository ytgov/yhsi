# Phase 5 — API Normalization Testing Plan

## Status Overview

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | Convert `require`/`var` → ES6 imports | **Done** | Old controllers were dead code — deleted. New routers already use ES6 imports. |
| 5.2 | Separate routes from controllers | **Done** | All 8 old mixed controller files deleted; new router files were already in place |
| 5.3 | Add input validation to old controllers | **Done** | New routers already use express-validator on all POST/PUT routes |
| 5.4 | Standardize response format | **Partial** | New routers use `{ data }` / `{ data, meta }`. Some older routers (catalogs, histories) still return `{ body }` or raw arrays — noted below |
| 5.5 | Standardize error handling | **Partial** | New routers use try/catch consistently; no centralized error middleware yet |
| 5.6 | Replace `any` types with interfaces | **Not started** | ~38 occurrences in new routers remain; lower priority |
| 5.7 | Replace moment.js → date-fns | **Done** | All 6 moment.js usages migrated to date-fns; moment can be removed from api/package.json |
| 5.8 | Upgrade Axios 0.21 → 1.7+ | **Done** | web/package.json updated; http-client.js updated for Axios 1.x paramsSerializer API |
| 5.9 | Clean up dead code, console.logs, `==` | **Partial** | Removed debug console.logs; commented-out blocks remain in photo/batch routers |

---

## Key Changes Made

### 5.1/5.2 — Deleted dead old controller files
The following files were never imported after new router files were created. They have been deleted:
- `api/controllers/aircrash.ts`
- `api/controllers/boats.ts`
- `api/controllers/catalogs.ts`
- `api/controllers/histories.ts`
- `api/controllers/owners.ts`
- `api/controllers/people.ts`
- `api/controllers/photoOwners.ts`
- `api/controllers/users.ts`
- `api/controllers/photos.ts`

`api/controllers/places-controller.ts` is retained (still used by `place-router.ts`).

### 5.7 — moment.js → date-fns migration
Files migrated:
- `api/routes/user-router.ts` — `format`, `isAfter`
- `api/routes/map-router.ts` — `addSeconds`, `subMinutes`, `isBefore`
- `api/routes/place-edits-router.ts` — `format`
- `api/routes/register-router.ts` — `format`, `addHours`
- `api/serializers/place-edit-serializer.ts` — `format`, `addHours`
- `api/services/place-service.ts` — `format`, `addHours`

**Next step:** Remove `"moment"` from `api/package.json` dependencies and run `npm uninstall moment` once confirmed working.

### 5.8 — Axios upgrade
- `web/package.json`: `"axios": "^0.21.4"` → `"^1.7.0"`
- `web/src/apis/http-client.js`: `paramsSerializer` updated to object form `{ serialize: fn }` for Axios 1.x compatibility

---

## 5.4 Response Format Gaps (Partial)

The following routers still return non-standard response formats:

| Router | Current format | Target |
|--------|---------------|--------|
| `catalogs-router.ts` | `res.send(array)` / `res.json({ body })` | `{ data: array }` |
| `histories-router.ts` | `res.json({ histories, count })` | `{ data, meta }` |
| `photo-owners-router.ts` | `res.json({ count, body })` | `{ data, meta }` |
| `aircrash-router.ts` | `res.json({ count, body })` | `{ data, meta }` |
| `boat-router.ts` | `res.json({ count, body })` | `{ data, meta }` |
| `people-router.ts` | `res.json({ count, body })` | `{ data, meta }` |

**Note:** Changing these would require updating the corresponding frontend controllers/APIs. Lower priority since they work.

## 5.5 Error Handling Gaps

No centralized error middleware exists. Each route independently handles errors. To add:
1. Create `api/middleware/error-handler.ts` with a standard `(err, req, res, next)` Express error middleware
2. Replace scattered try/catch with `next(err)` pattern
3. Register in `api/index.ts` after all routes

## 5.6 TypeScript `any` Gaps

~38 `any` annotations remain in new router files:
- `api/routes/photos-extra-router.ts` (most occurrences)
- `api/routes/aircrash-router.ts`
- `api/routes/boat-router.ts`
- `api/routes/map-router.ts`

These should be replaced with proper interfaces defined in `api/models/`.

---

## Test Steps

### 5.7 — date-fns migration

- [ ] Log in as Administrator, navigate to User Management (`/admin/users`)
- [ ] **Verify:** Last login date displays correctly in `YYYY-MM-DD @ h:mmAM/PM` format
- [ ] **Verify:** Users with expired access show "Expired" status
- [ ] Navigate to the Public Register — **verify:** recognition dates display as `YYYY-MM-DD`
- [ ] Edit a site with a recognition date — **verify:** date displays correctly
- [ ] Submit a site change request — **verify:** `editDate` is set to today's date in `YYYY-MM-DD` format
- [ ] Navigate to Maps — **verify:** the map loads without errors (GIS token refresh still works)

### 5.8 — Axios upgrade

- [ ] Run `cd web && npm install` to install Axios 1.7
- [ ] Start the frontend dev server — **verify:** no Axios-related errors in the console
- [ ] Load the Sites grid — **verify:** data loads (GET requests work)
- [ ] Perform a search with filters — **verify:** POST requests with body work
- [ ] Navigate to any page with query params (pagination) — **verify:** params serialize correctly with bracket format
- [ ] Upload a photo — **verify:** multipart POST still works

### 5.1/5.2 — Dead code deletion

- [ ] Run `cd api && npm run build` — **verify:** TypeScript compiles without errors about missing controller files
- [ ] Start the API — **verify:** all endpoints still respond (the new routers were already serving these)
- [ ] Test: `GET /api/boats`, `GET /api/people`, `GET /api/aircrash` — **verify:** all return data

### 5.9 — Console log cleanup

- [ ] Start the API and make several requests
- [ ] **Verify:** No debug messages like "-- Creating User account" appear in server logs
- [ ] **Verify:** No "LINKING" debug messages appear when linking photos
- [ ] **Verify:** Error messages still appear when actual errors occur (console.error calls retained)

---

## Regression checks

- [ ] Sites grid loads — create, edit, save all work
- [ ] User management — dates format correctly, expiry logic works
- [ ] Maps page — GIS token acquisition works without debug output
- [ ] Photo linking still works (removed debug console.log, not the logic)
- [ ] Place change requests — editDate is set correctly
- [ ] All API endpoints that were working before still work (controllers deleted were dead code)
