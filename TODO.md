# TODO — YHSI Codebase Normalization & Modernization

This document tracks technical debt, bugs, inconsistencies, and upgrade plans across the YHSI codebase.

---

## Table of Contents

1. [Critical: Security Issues](#1-critical-security-issues)
2. [Critical: Schema Mismatches](#2-critical-schema-mismatches)
3. [Critical: EOL Infrastructure](#3-critical-eol-infrastructure)
4. [High: EOL Libraries](#4-high-eol-libraries)
5. [High: Code Quality & Consistency](#5-high-code-quality--consistency)
6. [Medium: Outdated Dependencies](#6-medium-outdated-dependencies)
7. [Medium: Frontend Inconsistencies](#7-medium-frontend-inconsistencies)
8. [Low: Cleanup & Hygiene](#8-low-cleanup--hygiene)
9. [Upgrade Plans](#9-upgrade-plans)

---

## 1. Critical: Security Issues

### 1.1 Hardcoded Session Secret

- **File:** `api/routes/auth.ts:14`
- **Issue:** Session secret is hardcoded as `'supersecret'`
- **Fix:** Use `process.env.SESSION_SECRET` and require it in production

### 1.2 Insecure Session Configuration

- **File:** `api/routes/auth.ts:13-18`
- **Issue:** `resave: true` and `saveUninitialized: true` are not recommended for production. Missing `httpOnly`, `secure`, and `sameSite` cookie options.
- **Fix:** Configure secure session options, use a proper session store (not in-memory)

### 1.3 SQL Injection Risk via Unvalidated Sort Parameters

- **Files:**
  - `api/controllers/aircrash.ts:55,67` — `.orderBy(\`${sortBy}\`, \`${sort}\`)`
  - `api/controllers/boats.ts:40,50`
  - `api/controllers/people.ts:43`
  - `api/controllers/owners.ts:38`
- **Issue:** User-supplied `sortBy` and `sort` values are interpolated directly into Knex `.orderBy()` calls without validation
- **Fix:** Validate against a whitelist of allowed column names and sort directions

### 1.4 Missing Authentication on Sensitive Routes

- **File:** `api/routes/catalogs-router.ts:12,18,24,59,74`
- **Issue:** Multiple catalog endpoints (community, originalmedia, vesseltype GET/POST/PUT) have no authentication middleware
- **Fix:** Add `RequiresAuthentication` or `authorize()` middleware to all data-modifying routes

### 1.5 Database Host Exposed in Health Check

- **File:** `api/middleware/index.ts:29`
- **Issue:** Health check response includes `DB_HOST` value in HTML
- **Fix:** Return a generic "healthy" / "unhealthy" message without infrastructure details

---

## 2. Critical: Schema Mismatches

These are discrepancies between the production/test database schema (`db/YHISTEST.sql`) and what the application code assumes.

### 2.1 Boat Schema Tables — Code vs Reality

- **Issue:** Code references `Boat.Type`, `Boat.History`, `Boat.Photo`, `Boat.Owner`, `Boat.OwnerHistory`, `Boat.OwnerAlias`, `Boat.PastNames` as schema-qualified tables. The `Boat` schema exists in SQL but the actual tables live in the **dbo schema**, not in `Boat.*`.
- **Affected files:**
  - `api/controllers/catalogs.ts:57,62,68,72,92,108`
  - `api/controllers/photos.ts:99`
  - `api/routes/boat-router.ts`
  - `api/routes/catalogs-router.ts`
  - `api/services/boat-*` service files
  - Migrations `050`–`056` in `api/data/migrations/`
- **Risk:** Queries referencing `Boat.Type` etc. will fail at runtime unless migrations have already moved these tables into the Boat schema
- **Action:** Audit which schema these tables actually live in on prod/test, then fix either the migrations or the code references to match

### 2.2 Non-Existent `Boat.Place` Table

- **File:** `api/controllers/catalogs.ts:143`
- **Issue:** Code queries `db.from('Boat.Place')` but no `Boat.Place` table exists in the schema. The `else` branch appears to be a copy-paste bug — the `if` branch correctly uses `Place.Place`
- **Fix:** Change `Boat.Place` to `Place.Place` or `dbo.Place`

### 2.3 AirCrash `LocationText` — Computed vs Regular Column

- **File:** `api/data/migrations/046_air-crash.ts:74`
- **Issue:** Schema defines `LocationText` as a **computed column**: `AS ([Location].[STAsText]())`. The migration creates it as a regular `varchar(255)` nullable column.
- **Risk:** If the migration runs on a fresh database, `LocationText` won't auto-compute from the geography `Location` column
- **Fix:** Use a raw SQL statement in the migration to create the computed column

### 2.4 Place Table Missing French Columns

- **File:** `api/data/migrations/031_dbo-place.ts`
- **Issue:** Schema has `FR_PrimaryName` and `FR_Designations` columns on the `Place` table. These are not created by any migration.
- **Action:** Verify if these exist from legacy data or need a new migration

### 2.5 Photo Table Missing YRHP Columns

- **File:** `api/data/migrations/20251021155103_update-dbo-photo-table.ts`
- **Issue:** Schema has `YRHPOrder` (int), `ShowInRegister` (bit), `IsYRHPCoverImage` (bit), and `photoSize` (computed) on `dbo.Photo`. These are not reflected in migrations.
- **Action:** Verify if these exist from legacy data or need a new migration

---

## 3. Critical: EOL Infrastructure

### 3.1 Node.js 16 — EOL September 2023

- **Files:** `Dockerfile:1`, `api/development.Dockerfile`, `web/development.Dockerfile`
- **Current:** `node:16-alpine3.15`
- **Target:** Node 20 LTS (or Node 22 LTS)
- **Impact:** No security patches for 2+ years
- **See:** [Upgrade Plan 9.1](#91-node-20-upgrade)

### 3.2 MSSQL Server 2017 — EOL October 2022

- **Files:** `docker-compose.dev.yml`, `docker-compose.development.yml`, `docker-compose.test.yml`
- **Current:** `mcr.microsoft.com/mssql/server:2017-latest-ubuntu`
- **Target:** MSSQL 2022
- **Impact:** No security patches for 3+ years
- **See:** [Upgrade Plan 9.2](#92-mssql-2022-upgrade)

### 3.3 npm 8 Pinned in Dockerfile

- **File:** `Dockerfile:20`
- **Current:** `npm install -g npm@8.5.5`
- **Target:** Remove pin (use npm bundled with Node 20/22) or pin to npm 10+

### 3.4 Legacy API Dockerfile with Node 13

- **File:** `api/Dockerfile` (uses `oraclelinux:7-slim` + Node 13)
- **Status:** Node 13 EOL June 2020; appears to be dead/legacy code
- **Action:** Confirm unused and delete, or replace

---

## 4. High: EOL Libraries

### 4.1 Vue 2 — EOL December 2023

- **File:** `web/package.json`
- **Current:** Vue 2.6.11, Vue Router 3.2.0, Vuex 3.4.0, Vuetify 2.6.4, @vue/cli 4.5.0
- **Target:** Vue 3 + Vue Router 4 + Pinia + Vuetify 3 + Vite
- **Impact:** Major migration effort. No security patches on Vue 2.
- **See:** [Upgrade Plan 9.3](#93-vue-3-migration)

### 4.2 Moment.js — Maintenance Mode

- **File:** `api/package.json` (v2.29.4)
- **Status:** Officially in maintenance mode, no new features. 67KB minified.
- **Target:** Replace with `date-fns` or `dayjs`
- **Action:** Grep for `moment` usage across `api/` and migrate call-by-call

### 4.3 Axios 0.21 — Multiple Major Versions Behind

- **File:** `web/package.json` (v0.21.4)
- **Current latest:** 1.7+
- **Issue:** Known vulnerabilities in 0.x series
- **Action:** Upgrade to 1.7+. API changes are minimal but check interceptor usage.

### 4.4 babel-eslint — Deprecated

- **File:** `web/package.json` (v10.1.0)
- **Issue:** Package renamed to `@babel/eslint-parser`
- **Action:** Replace with `@babel/eslint-parser` (or remove entirely when migrating to Vue 3 + Vite)

---

## 5. High: Code Quality & Consistency

### 5.1 Mixed CommonJS and ES6 Imports

- **Files affected:**
  - `api/controllers/aircrash.ts` — `const express = require('express')` + `import { Request } from 'express'`
  - `api/controllers/boats.ts`
  - `api/controllers/people.ts`
  - `api/controllers/owners.ts`
  - `api/controllers/catalogs.ts`
  - `api/controllers/histories.ts`
  - `api/controllers/photoOwners.ts`
  - `api/controllers/users.ts`
- **Good example:** `api/controllers/places-controller.ts` uses consistent ES6 imports
- **Fix:** Convert all `require()` / `module.exports` to `import` / `export`

### 5.2 `var` Usage Instead of `const`/`let`

- **Files:**
  - `api/controllers/aircrash.ts:6` — `var _ = require('lodash')`
  - `api/controllers/boats.ts:8`
  - `api/controllers/people.ts:2-3,6`
  - `api/controllers/users.ts:3,6`
  - `api/controllers/catalogs.ts:2-3,5`
- **Fix:** Replace all `var` with `const` or `let`

### 5.3 Inconsistent Response Format

Four different response wrapper patterns are used across the API:

| Pattern | Example | Used In |
|---------|---------|---------|
| `{ count, body }` | `res.send({ count: counter, body: aircrashes })` | aircrash.ts |
| bare data | `res.send(boat)` | boats.ts |
| `{ data }` | `res.json({ data: users })` | user-router.ts |
| `{ messages }` | `res.json({ messages: [{ variant, text }] })` | user-router.ts |

- **Fix:** Standardize on a single response envelope (e.g., `{ data, meta?, messages? }`)

### 5.4 Inconsistent Route Architecture

- **Old pattern (routes-in-controller):** `api/controllers/aircrash.ts`, `boats.ts`, `people.ts`, `owners.ts`, `catalogs.ts` — define Express router, routes, and business logic in one file
- **New pattern (separated):** `api/routes/place-router.ts` + `api/controllers/places-controller.ts` + `api/services/place-service.ts`
- **Fix:** Refactor old controllers to follow the routes → controller → service pattern

### 5.5 Excessive Use of `any` Type

- 30+ files use `: any` annotations extensively
- **Examples:**
  - `api/controllers/aircrash.ts:125` — `newInfoSources.map((source: any) => ...)`
  - `api/controllers/boats.ts:136,140,170` — `(owner: any)`, `(name: any)`
  - `api/controllers/photos.ts:77`
  - `api/controllers/people.ts` — throughout
- **Fix:** Define interfaces for database entities and request/response bodies

### 5.6 Missing Input Validation on Old Controllers

- Old controllers (`aircrash.ts`, `boats.ts`, `people.ts`, `catalogs.ts`) have no `express-validator` validation on POST/PUT routes
- Newer routes (`place-router.ts`, `boat-router.ts`) use validation correctly
- **Fix:** Add validation to all data-modifying endpoints

### 5.7 Inconsistent Error Handling

- Some controllers: `try/catch` with `res.status(422).json()`
- Some controllers: `.catch()` promise chains
- Some: no error handling at all
- **Fix:** Standardize on `try/catch` in async handlers with a shared error-handling middleware

---

## 6. Medium: Outdated Dependencies

### 6.1 API Dependencies

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| express | 4.17.1 | 4.21+ | 3+ years of security patches missing |
| puppeteer | 19.8.0 | 22+ | Multiple majors behind |
| sharp | 0.30.5 | 0.33+ | Pinned, 18+ months behind |
| helmet | 5.0.2 | 7+ | Functional but outdated |
| knex | 1.0.4 | 3+ | Major version behind |
| typescript (api) | 4.6.3 | 5.5+ | Major version behind |
| typescript (root) | 4.5.4 | 5.5+ | Major version behind |
| @types/node | 14.14.5 | 20+ | Severely outdated |
| @types/express | 4.17.13 | 4.17.21+ | 3+ years behind |
| mocha | 9.2.2 | 10+ | Major behind |

### 6.2 Frontend Dependencies

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| html2canvas | 1.0.0-rc.7 | 1.4+ | RC build in production |
| jspdf | 2.3.1 | 2.5+ | Minor behind |
| eslint (web) | 6.7.2 | 9+ | 3 major versions behind |
| eslint-plugin-vue | 6.2.2 | 9+ | 3 major versions behind |

### 6.3 ESLint Version Fragmentation

- Root: v9.12.0
- API: v8.13.0
- Web: v6.7.2
- **Fix:** Unify to ESLint 9 with flat config across all packages

---

## 7. Medium: Frontend Inconsistencies

### 7.1 Copy-Paste Bug — Wrong v-model Binding

- **File:** `web/src/components/InterpretiveSites/InterpetiveSiteComponents/Form.vue:94`
- **Issue:** `MaintainedBy` field is bound to `v-model="fields.SiteName"` instead of `fields.MaintainedBy`
- **Fix:** Change to `v-model="fields.MaintainedBy"`

### 7.2 Inconsistent API Call Patterns

- Some components call API services directly (e.g., `BoatsForm.vue`)
- Some components dispatch Vuex actions
- Some components import the store and call actions on it
- **Fix:** Standardize: components → Vuex actions → API services

### 7.3 Typo in Directory Name

- **Path:** `web/src/components/InterpretiveSites/InterpetiveSiteComponents/`
- **Issue:** `InterpetiveSite` is missing an `r` — should be `InterpretiveSite`
- **Fix:** Rename directory (will require updating all imports)

---

## 8. Low: Cleanup & Hygiene

### 8.1 Dead / Commented-Out Code

Remove these commented-out blocks:

- `api/controllers/people.ts:215-235` — commented-out DELETE route
- `api/controllers/histories.ts:9-24,62-81` — commented-out GET routes
- `api/controllers/boats.ts:4-6` — commented-out CORS setup
- `api/controllers/aircrash.ts:54,66` — commented-out `.orderBy()` lines
- `api/controllers/boats.ts:39,49` — commented-out `.orderBy()` lines
- `api/routes/user-router.ts:75-78` — commented-out permission check

### 8.2 `console.log()` in Production Code

- `api/controllers/photos.ts:83`
- `api/controllers/places-controller.ts:41`
- **Fix:** Remove or replace with structured logger (e.g., Sentry breadcrumbs, pino, winston)

### 8.3 `==` Instead of `===`

- `api/controllers/people.ts:99` — `if (updatePerson.length == 0)`
- `api/routes/user-router.ts:26` — `if (user.status == 'Active' && isExpired)`
- `web/src/components/Administration/AdminDashboard.vue:148` — `if (url == '')`
- **Fix:** Replace with strict equality `===`

### 8.4 Unnecessary `.then()` Chains

- `api/controllers/aircrash.ts:131-133` — `.then((rows: any) => { return rows; })`
- `api/controllers/boats.ts:149-151,164-166,178-180` — same pattern
- **Fix:** Remove `.then()` that just returns its argument

### 8.5 Inconsistent Database Field Naming in Controllers

- AirCrash uses lowercase: `dbo.vAircrash.yacsinumber`
- Boats uses PascalCase: `boat.boat.RegistrationNumber`
- Mixed: `boat.boatowner.ownerid`
- **Note:** MSSQL is case-insensitive by default, so this is a readability/consistency issue, not a bug

---

## 9. Upgrade Plans

### 9.1 Node 20 Upgrade

**Scope:** All Dockerfiles + CI/CD

1. Update `Dockerfile:1` from `node:16-alpine3.15` to `node:20-alpine`
2. Update `api/development.Dockerfile` to `node:20`
3. Update `web/development.Dockerfile` to `node:20`
4. Remove `RUN npm install -g npm@8.5.5` from Dockerfile (Node 20 ships with npm 10)
5. Run `npm install` in all three package roots to regenerate lock files
6. Test for breaking changes in native modules (sharp, mssql, puppeteer)
7. Update Puppeteer + Chromium compatibility (alpine Chromium version must match puppeteer)

**Risk:** Medium — native modules (sharp, mssql) may need version bumps. Puppeteer/Chromium pairing is fragile on Alpine.

### 9.2 MSSQL 2022 Upgrade

**Scope:** Docker Compose files (dev/test only — prod DB is managed externally)

1. Update image in `docker-compose.dev.yml`, `docker-compose.development.yml`, `docker-compose.test.yml` from `mcr.microsoft.com/mssql/server:2017-latest-ubuntu` to `mcr.microsoft.com/mssql/server:2022-latest`
2. Test database restore from backup against 2022
3. Verify Knex mssql driver compatibility
4. Test geography type / spatial queries still work
5. Coordinate with whoever manages the production/test database server

**Risk:** Low for dev containers. Prod upgrade is a separate infrastructure task.

### 9.3 Vue 3 Migration

**Scope:** Entire `web/` directory — this is the largest single effort

**Phase 1 — Preparation (while still on Vue 2):**
1. Install `@vue/compat` to enable Vue 2.7 compatibility mode
2. Replace Vuex with Pinia (Pinia supports both Vue 2.7 and Vue 3)
3. Replace `babel-eslint` with `@babel/eslint-parser`
4. Upgrade axios to 1.7+
5. Eliminate all `this.$refs` anti-patterns
6. Standardize all components to use consistent Options API patterns

**Phase 2 — Vue 3 Migration:**
1. Upgrade to Vue 3 + `@vue/compat`
2. Migrate Vue Router 3 → 4
3. Upgrade Vuetify 2 → 3 (this is the hardest part — significant API changes)
4. Replace Vue CLI / Webpack with Vite
5. Convert Pug templates to HTML (optional but recommended for Vite compatibility)
6. Remove `@vue/compat` once all warnings are resolved

**Phase 3 — Modernization:**
1. Adopt Composition API + `<script setup>` for new components
2. Replace html2canvas + jsPDF with modern alternatives if needed
3. Upgrade Leaflet / mapping stack

**Risk:** High — Vuetify 2 → 3 has extensive breaking changes. Budget significant time.

### 9.4 API Normalization

**Scope:** Refactor old controllers to match new patterns

1. **Standardize imports:** Convert all `require()`/`module.exports` to ES6 `import`/`export`
2. **Separate routes from controllers:** Extract router definitions from `aircrash.ts`, `boats.ts`, `people.ts`, `owners.ts`, `catalogs.ts`, `histories.ts`, `photoOwners.ts`, `users.ts` into `routes/` files
3. **Standardize response format:** Pick one envelope (`{ data, meta?, messages? }`) and apply everywhere
4. **Add validation:** Add `express-validator` to all POST/PUT/PATCH/DELETE routes
5. **Add types:** Define interfaces for all database entities, replace `any` with proper types
6. **Standardize error handling:** Create shared error-handling middleware, remove ad-hoc try/catch variations
7. **Replace moment.js:** Migrate to date-fns or dayjs

**Suggested order:** Security fixes (1.x) → Schema fixes (2.x) → One controller at a time, starting with the most-used domain

### 9.5 Dockerfile Modernization

**Current issues with `Dockerfile`:**
- Node 16 base
- npm 8 pinned
- Commented-out sharp workaround
- No multi-stage build (builds web + api in one image)
- No `.dockerignore` best practices visible

**Target Dockerfile pattern:**
1. Use Node 20 Alpine base
2. Multi-stage build: build stage (compile TS + Vue) → production stage (minimal runtime)
3. Remove npm pin
4. Add proper `.dockerignore` if missing
5. Consider separating web build from API image for better caching
