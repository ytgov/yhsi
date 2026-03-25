# CLAUDE.md — YHSI Developer Reference

## Project Overview

**YHSI (Yukon Heritage Sites Initiative)** is a heritage site management web application for tracking historical and cultural records in the Yukon. It is a monorepo with three components: an Express/TypeScript API, a Vue 2 frontend, and a SQL Server database.

## Tech Stack

- **API** (`/api`): Node.js + Express 4 + TypeScript, port 3000
- **Frontend** (`/web`): Vue 2.6 + Vuetify 2.6 + Vuex 3 + Vue Router 3, port 8080
- **Database**: Microsoft SQL Server (MSSQL) via Knex.js query builder
- **Auth**: OIDC/OAuth via `express-openid-connect`
- **Maps**: Leaflet + ESRI ArcGIS (esri-loader)
- **Monitoring**: Sentry / GlitchTip
- **Templates**: Pug
- **Testing**: Mocha + Chai (API only)

## Architecture

Service-based MVC pattern:

```
Routes (Express routers, input validation via express-validator)
  → Controllers (orchestration)
    → Services (business logic, BaseService with perform() pattern)
      → Knex query builder → MSSQL
```

## Project Structure

```
/api
  index.ts              # Express entry point
  config.ts             # Environment variable configuration
  routes/               # 50+ Express routers (one per domain)
  controllers/          # Domain controllers
  services/             # 30+ business logic services
  models/               # TypeScript data models
  middleware/            # Auth, validation (RequiresAuthentication, authorize())
  policies/             # Access control policies
  data/
    migrations/         # 90+ Knex migrations
    seeds/              # Environment-specific seed data (development/production/test)
    *-entities.ts       # Field definitions (PLACE_FIELDS, PHOTO_FIELDS, etc.)
  db/db-client.ts       # Knex instance
  config.d/knexfile.ts  # Knex configuration
  utils/                # Helpers (PDF, images, spatial)
  @types/               # Custom type definitions

/web
  src/
    components/         # Vue components organized by domain
    pages/              # Page-level views
    views/              # Auth views (sign-in, sign-up)
    store/              # Vuex modules (auth, places, photos, boats, etc.)
    modules/            # Feature modules (AirplaneCrashes, maps)
    apis/               # ~30 API client modules (Axios)
    router.js           # Vue Router config
    plugins/            # Vuetify setup
    layouts/            # Layout components

/db
  create_schema.sql     # Full database schema
  scripts/              # Ad-hoc SQL scripts
  backups/              # Database backup mount point
```

## Core Business Domains

| Domain | Route Prefix | Description |
|--------|-------------|-------------|
| Places/Sites | `/api/place` | Primary entity — heritage locations with change request workflow |
| Photos | `/api/photo`, `/api/photobatch` | Batch management, ownership, projects, subjects |
| Boats | `/api/boats` | Historical watercraft with ownership history |
| Burials | `/api/burials` | Cemetery and burial records |
| People | `/api/people` | Historical figures |
| Airplane Crashes | `/api/aircrash` | Aviation incidents (YACSI numbers) |
| Interpretive Sites | `/api/interpretive-sites` | Educational sites with actions, assets, inspections |
| Communities | `/api/communities` | Geographic/administrative communities |
| Maps | `/api/maps` | Geospatial interface |

There are 40+ lookup/reference tables (association-types, category-types, condition-types, etc.) managed via admin UI and corresponding API routes.

## Authorization

16 roles with granular access control:

- **Admin**: Administrator, Site Admin
- **Sites**: Site Editor, Site Viewer, Site Viewer Limited
- **Photos**: Photo Admin, Photo Editor, Photo Viewer
- **Domain-specific**: Airplane Crash Editor/Viewer, Boats Editor/Viewer, Burials Editor/Viewer, People Editor, Place Editor, YRHP Editor, Interpretive Sites Editor/Viewer
- **Maps**: Advanced Maps

Authorization middleware: `authorize(roles[], allowPending?)` in `/api/middleware/authorization.ts`.

## Common Commands

```bash
# Development (Docker)
docker volume create yhsi_sqlvolume
docker compose -f docker-compose.development.yml build
docker compose -f docker-compose.development.yml up

# Or using the dev helper
dev build
dev up

# API standalone
cd api
npm install
cp .env .env.development    # Edit with local DB credentials
npm run start               # ts-node-dev on port 3000

# Frontend standalone
cd web
npm install
npm run start               # Vue CLI dev server on port 8080

# Database migrations
# Via browser: http://localhost:3000/migrate/latest
# Via CLI:
cd api
npm run knex -- migrate:latest

# Tests (API only)
cd api
npm run test                # Mocha test suite

# Build
cd api && npm run build     # TypeScript compile + tsc-alias
cd web && npm run build:web # Vue CLI production build

# Lint
cd web && npm run lint
```

## Database Notes

- **Engine**: Microsoft SQL Server (not PostgreSQL) — use T-SQL syntax
- **Query builder**: Knex.js (no raw ORM, use Knex methods)
- **Connection config**: Environment variables `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` (default 1433)
- **Dev credentials**: SA password `1m5ecure!` (in docker-compose.dev.yml)
- **Dev and test databases are shared** — avoid tests that mutate state

## Key Patterns

- **Services** extend a `BaseService` class with a `perform()` method
- **Entity field definitions** are arrays (e.g., `PLACE_FIELDS`) in `/api/data/*-entities.ts`
- **Frontend API clients** are in `/web/src/apis/` — one per domain, using Axios
- **Vuex store modules** mirror backend domains (places, photos, boats, etc.)
- **Pug** is used for Vue templates (not HTML `<template>` syntax)
- **File uploads** handled via Multer; image processing via Sharp
- **PDF generation** uses Puppeteer (backend) and jsPDF (frontend)
- **Static SPA serving**: The production build serves the compiled Vue app from the Express server with fallback to `index.html`
