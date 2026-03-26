# YHSI — Prioritized Work Plan

This plan combines technical debt (TODO.md) and upstream feature/bug requests (ISSUES.md) into a sequenced execution order. Items are grouped into phases where earlier phases unblock or de-risk later ones.

---

## Phase 0 — Security & Data Integrity (Do First)

These items pose active risk to production. Fix before any feature work.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 0.1 | Hardcoded session secret | TODO 1.1 | 30 min | Use `process.env.SESSION_SECRET` |
| 0.2 | Insecure session config | TODO 1.2 | 30 min | Add `httpOnly`, `secure`, `sameSite`; use proper session store |
| 0.3 | SQL injection via sort params | TODO 1.3 | 1-2 hr | Whitelist allowed columns in aircrash, boats, people, owners controllers |
| 0.4 | Missing auth on catalog routes | TODO 1.4 | 30 min | Add `RequiresAuthentication` to unprotected endpoints |
| 0.5 | DB host in health check | TODO 1.5 | 15 min | Return generic status only |

**Total: ~3-4 hours. No dependencies. Can be done in one PR.**

---

## Phase 1 — Schema & Infrastructure Fixes

Fix the foundation before building on it. Several GitHub issues (#149, #167, boat-related issues) depend on schema correctness.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 1.1 | Boat schema mismatch (`Boat.*` vs `dbo.*`) | TODO 2.1 | 2-4 hr | Audit prod/test, then fix code refs or migrations. **Blocks all boat issues (#149, #177, #121)** |
| 1.2 | `Boat.Place` copy-paste bug | TODO 2.2 | 15 min | Change to `Place.Place` — can bundle with 1.1 |
| 1.3 | AirCrash `LocationText` computed column | TODO 2.3 | 1 hr | Fix migration to use raw SQL for computed column |
| 1.4 | Place table missing French columns | TODO 2.4 | 30 min | Verify existence, add migration if needed |
| 1.5 | Photo table missing YRHP columns | TODO 2.5 | 30 min | Verify existence, add migration if needed. **Blocks #143 (YRHP security)** |
| 1.6 | Node 16 → Node 20 | TODO 3.1, 3.3, 3.4 | 4-8 hr | Update all Dockerfiles, remove npm pin, delete legacy Node 13 Dockerfile, test native modules |
| 1.7 | MSSQL 2017 → 2022 (dev only) | TODO 3.2 | 1-2 hr | Update docker-compose files, test restore + spatial queries |
| 1.8 | Interpretive Sites v-model bug | TODO 7.1 | 15 min | `SiteName` → `MaintainedBy` binding. **Partially fixes #88** |

**Total: ~10-16 hours. Phase 1.1 is the most critical — audit needed before boat work.**

---

## Phase 2 — High-Confidence Bug Fixes

These are bugs with clear reproduction paths and understood code. Fixing them now delivers visible value and builds confidence in the codebase.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 2.1 | Burials: Add new not redirecting | Issue #215 | 1-2 hr | Likely routing config fix |
| 2.2 | AirCrash pagination broken | Issue #147 | 2-3 hr | Code already has a comment noting the bug area |
| 2.3 | YHSI form updates (3 sub-tasks) | Issue #169 | 2-3 hr | Historical Pattern label, Borden typo (may be fixed), lat/long validation |
| 2.4 | Site Editor can't edit | Issue #163 | 2-4 hr | Role check missing in frontend computed properties or policy scope |
| 2.5 | Site Change Request save broken | Issue #164 | 2-4 hr | Investigate save action — may be a silent API error |
| 2.6 | AirCrash print/PDF corrupt | Issue #159/#152 | 3-5 hr | Debug Puppeteer PDF generation; likely one issue, two reports |

**Total: ~12-21 hours. All independent of each other — can be parallelized across developers.**

---

## Phase 3 — High-Confidence Features

Clear requirements, straightforward implementation. These are the quick wins from the GitHub issues.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 3.1 | Add Record Status field | Issue #167 | 4-6 hr | New migration + API + form field + grid column/filter. **Must complete before #179** |
| 3.2 | Mandatory fields update | Issue #179 | 1-2 hr | Adjust validation rules. **Depends on 3.1** |
| 3.3 | Boat service date extend to 1800 | Issue #177 | 1 hr | Extend date picker min. **Depends on Phase 1.1 (boat schema fix)** |
| 3.4 | Vessel type active/inactive flag | Issue #149 | 2-3 hr | Add column + admin toggle + filter inactive from dropdowns. **Depends on Phase 1.1** |
| 3.5 | NTS map sheet dropdown | Issue #105 | 2-3 hr | Replace text field with searchable dropdown using existing data source |
| 3.6 | Export grid to CSV | Issue #97 | 3-4 hr | Specified fields: YHSI ID, name, NTS, community, category, lat, long, property category |
| 3.7 | Pending user request on dashboard | Issue #160 | 2-3 hr | Admin dashboard card with pending count/list |

**Total: ~15-22 hours. Items 3.1→3.2 are sequential; 3.3+3.4 need Phase 1.1; rest are independent.**

---

## Phase 4 — Admin Screens & Widget Integration

These follow established patterns in the codebase. Moderate effort, lower risk.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 4.1 | Admin: Contributing Resource | Issue #174 | 3-4 hr | Follow existing admin CRUD pattern |
| 4.2 | Admin: Community | Issue #173 | 3-4 hr | Same pattern, table already exists |
| 4.3 | Admin: Photo owner | Issue #172 | 3-4 hr | Same pattern |
| 4.4 | Show/search secondary names | Issue #96 | 4-6 hr | Join/aggregate names on grid, update search query |
| 4.5 | Coordinate system selector fixes | Issue #110 | 3-5 hr | Add UTM zones, fix WSG→WGS typo, fix NAD83, fix DMS negatives |
| 4.6 | Photo widget: Boats | Issue #121 | 2-3 hr | Verify/fix reusable widget integration |
| 4.7 | Photo widget: Burials | Issue #120 | 2-3 hr | Same pattern |
| 4.8 | Photo widget: Interpretive Sites | Issue #119 | 2-3 hr | Same pattern |
| 4.9 | Photo widget: Associated record links | Issue #124 | 3-4 hr | Ensure all module links work |

**Total: ~26-36 hours. All items are independent and can be parallelized.**

---

## Phase 5 — API Normalization

Clean up inconsistent patterns from multiple developers. This reduces future bug surface and makes all subsequent work easier. Can be done controller-by-controller.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 5.1 | Convert `require`/`var` → ES6 imports/`const` | TODO 5.1, 5.2 | 2-3 hr | All old controllers |
| 5.2 | Separate routes from controllers | TODO 5.4 | 6-10 hr | aircrash, boats, people, owners, catalogs, histories, photoOwners, users |
| 5.3 | Add input validation to old controllers | TODO 5.6 | 4-6 hr | express-validator on all POST/PUT routes |
| 5.4 | Standardize response format | TODO 5.3 | 3-5 hr | Pick `{ data, meta?, messages? }` envelope |
| 5.5 | Standardize error handling | TODO 5.7 | 2-3 hr | Shared error middleware |
| 5.6 | Replace `any` types with interfaces | TODO 5.5 | 6-10 hr | Define entity interfaces, apply across controllers |
| 5.7 | Replace moment.js → date-fns/dayjs | TODO 4.2 | 2-3 hr | Grep and migrate call-by-call |
| 5.8 | Upgrade Axios 0.21 → 1.7+ | TODO 4.3 | 1-2 hr | Check interceptor usage |
| 5.9 | Clean up dead code, console.logs, `==` | TODO 8.1-8.4 | 1-2 hr | Batch cleanup |

**Total: ~27-44 hours. Do 5.1 first (enables cleaner diffs), then 5.2 (biggest structural change), then rest in any order.**

---

## Phase 6 — Medium-Effort Features

Features requiring more design decisions or investigation. Some are blocked on stakeholder input.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 6.1 | Photo batch updates (4 sub-features) | Issue #162 | 8-12 hr | Multi-upload, record association, delete, inline owner creation |
| 6.2 | Location widget: reusable component | Issue #112-116 | 6-10 hr | Ensure MapLoader.vue is properly integrated across all modules |
| 6.3 | Location widget: map centering | Issue #111 | 2-4 hr | Needs decision on Leaflet vs ESRI JS API |
| 6.4 | Print record: all modules | Issue #125 | 8-12 hr | Create Pug templates + PDF endpoints per module |
| 6.5 | Print grid: all modules | Issue #126 | 6-10 hr | Grid PDF export per module |
| 6.6 | Select from grid and export | Issue #108 | 4-6 hr | Multi-select + batch PDF |
| 6.7 | Save search/filters | Issue #109 | 6-10 hr | Needs design decisions on persistence, scope, sharing |
| 6.8 | Interpretive Sites form issues | Issue #88 | 6-10 hr | 7 sub-issues, some may overlap with widget work. Partially fixed by Phase 1.8 |

**Total: ~46-74 hours. Items 6.4-6.6 (print/export) should be done together. 6.7 needs stakeholder input first.**

---

## Phase 7 — Blocked / Needs Stakeholder Input

Cannot proceed without external information or decisions.

| # | Item | Source | Blocker |
|---|------|--------|---------|
| 7.1 | FN name spelling corrections | Issue #176 | Need correction list from stakeholder |
| 7.2 | Map: FN access filtering | Issue #170 | Need role/permission details + may involve ArcGIS config |
| 7.3 | YRHP viewer role | Issue #143 | YRHP module incomplete; need scope definition |
| 7.4 | Standardize all modules (7 issues) | Issues #127-133 | Need YG template reference/mockups |
| 7.5 | Sub-navigation update | Issue #136 | Need template reference |

**Action: Request clarification from @dpdavids on these items. Comments posted on #176, #170, #143, #136, #130.**

---

## Phase 8 — Major Upgrades (Plan Separately)

These are large-scale migrations that should be planned as dedicated projects, not mixed with feature work.

| # | Item | Source | Est. Effort | Notes |
|---|------|--------|-------------|-------|
| 8.1 | Vue 2 → Vue 3 migration | TODO 4.1, 9.3 | 80-160 hr | Vuetify 2→3 is the hardest part. Do after all Phase 2-6 frontend work is stable. |
| 8.2 | ESLint unification (6→8→9) | TODO 6.3, 4.4 | 4-8 hr | Can do during Vue 3 migration |
| 8.3 | Dependency updates (express, knex, etc.) | TODO 6.1, 6.2 | 4-8 hr | After Node 20 upgrade (Phase 1.6) |
| 8.4 | Dockerfile modernization | TODO 9.5 | 4-6 hr | Multi-stage build, after Node 20 upgrade |
| 8.5 | Directory typo fix (`InterpetiveSite`) | TODO 7.3 | 1 hr | Touches all imports — do during Vue 3 migration to minimize churn |

---

## Recommended Execution Order

```
Phase 0  (3-4 hr)    Security fixes — immediate, one PR
    ↓
Phase 1  (10-16 hr)  Schema + infrastructure — unblocks everything else
    ↓
Phase 2  (12-21 hr)  Bug fixes — visible value, builds confidence
    ↓
Phase 3  (15-22 hr)  Quick-win features — high confidence, clear requirements
    ↓
Phase 4  (26-36 hr)  Admin screens + widgets — established patterns
    ↓
Phase 5  (27-44 hr)  API normalization — cleaner code for future work
    ↓
Phase 6  (46-74 hr)  Medium-effort features — needs some design decisions
    ↓
Phase 7  (varies)    Blocked items — unblock as stakeholder answers come in
    ↓
Phase 8  (90-180 hr) Major upgrades — separate project planning
```

**Total estimated: ~230-400 hours** (excluding Phase 7 blocked items and Phase 8 major upgrades)

---

## Cross-Cutting Notes

1. **Boat issues (#149, #177, #121) are all blocked on Phase 1.1** (boat schema audit). Don't start boat work until the `Boat.*` vs `dbo.*` schema question is resolved.

2. **#179 (mandatory fields) depends on #167 (Record Status field)**. The mandatory fields list includes "Record Status (new)" which needs to exist first.

3. **Print/PDF issues (#152, #159, #125, #126, #108) share infrastructure**. Fix the AirCrash PDF bug first (Phase 2.6), then use the working solution as the pattern for other modules (Phase 6.4-6.6).

4. **Interpretive Sites issues (#88, #114, #119, #131) overlap significantly**. The v-model bug (Phase 1.8) is a quick fix; the rest should be batched together in Phase 6.8.

5. **Phase 5 (API normalization) can be interleaved** with feature work — normalize a controller right before adding features to it. For example, normalize the boats controller before implementing #149 and #177.

6. **Phase 7 items should be actively pursued** — the clarification comments on GitHub are posted. Follow up if no response within a week.
