# YHSI Web Application

## Developing in this Repository

Requires Docker. The `dev` helper (`bin/dev`) wraps `docker compose -f docker-compose.development.yml`.

1. Copy `api/.env.sample` to `api/.env.development` and fill in the sign-in settings. Database
   settings come from `docker-compose.development.yml` and override any `DB_*` values in that file.

2. Build and boot:

   ```bash
   dev build
   dev up
   ```

   | Service    | Address                                                                        |
   | ---------- | ------------------------------------------------------------------------------ |
   | Web        | <http://localhost:8080>                                                        |
   | API        | <http://localhost:3000>                                                        |
   | SQL Server | `localhost,1433`, user `sa`, password `1m5ecure!`, database `yhsi_development` |

   On boot the API creates the database and runs the migrations in `api/db/migrations`. The
   database runs SQL Server 2019 RTM-GDR to match production.

3. Sign up at <http://localhost:8080>, then make yourself an administrator with `dev sqlcmd`:

   ```sql
   UPDATE [Security].[User]
   SET
     [roles] = 'Administrator',
     [status] = 'Active'
   WHERE
     [email] = 'some-user@some-host.com';
   
   GO
   ```

4. Optional: load sample places.

   ```bash
   dev run -e SEED_SAMPLE_PLACES=true api npm run knex -- seed:run --specific=02_places-seeds.ts
   ```

API and web code reload automatically on change.

### Working Against a Restored Backup

Startup refuses to migrate a database without migration history, so a restored backup runs
outside the Docker app services:

1. Put the backup at `db/backups/yhsi.bak`, then start SQL Server and restore it:

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   docker compose -f docker-compose.dev.yml exec sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P '1m5ecure!' -C \
     -Q "RESTORE DATABASE YHSI FROM DISK = N'/backups/yhsi.bak' WITH FILE = 1"
   ```

2. Set `DB_NAME=YHSI` and the other `DB_*` values in `api/.env.development`, then run each app in its
   own terminal:

   ```bash
   cd api && npm install && npm run start
   cd web && npm install && npm run start
   ```

## Linting and Formatting

Install dependencies in the root, `api`, and `web`. Run these commands from the repository root:

```bash
npm --prefix api run lint
npm --prefix web run lint
npm run format:check -- web/src/App.vue
npm run format -- web/src/App.vue
```

Linting reports issues without rewriting files. Pass the files you want to format to the root Prettier scripts; they share one configuration for the API, Vue templates (including Pug), and embedded SQL.

## Local Testing

TODO

### Helful Git Hooks

A helpful git hook that will prevent you from accidentally disabling the test suite is below.

1. Add the following to the `<project-root>/.git/hooks/pre-commit` file, or create it if it doesn't exist.

```bash
# Redirect output to stderr.
exec 1>&2

# prevent it.only context.only or describe.only commited
if [ "$allowonlytests" != "true" ] &&
    test $(git diff --cached | grep -E "\b(it|context|describe).only\("  | wc -l) != 0
then
    cat <<\EOF
Error: Attempt to add it.only or describe.only - which may disable all other tests

If you know what you are doing you can disable this check using:

    git config hooks.allowonlytests true
EOF
    exit 1
fi

exit 0
```

1. Make the file executable vai `chmod +x .git/hooks/pre-commit`

## Running the application production

Since the database for this system is managed externally, PRODUCTION version only needs to run the API and Web services.
The `Dockerfile` in this directory builds the Vue.js web front-end, and serves the compiled files via the Node.js API,
so only one container is required to serve the front-end and back-ends; thus saving resources.

The production image still starts `node ./dist/index.js` directly. `boot-app.sh` exits in
production, and both Knex commands reject production targets.

Before enabling production migrations, rehearse against a current restored backup. Compare the
schema with the baseline migrations (`20261127130250` through `20261127130301`), reconcile any
drift, and record those migrations as applied without running them. Then run compiled migrations
once per release with a separate database account. Do not enable development database creation or
seeds in that release step.

On the PRODUCTION server, the application is run via docker-compose, so the code needs to be cloned to the server and
the appropriate environment variables set using the following commands:

1. Set the environment variables for the back-end.

```
cp /api/.env /api/.env.production
vi /api/.env.production
```

1. Set the global host port.

```bash
cp .env.sample .env
vi .env
```

> Note that the file needs to be named `.env` and it needs to be at the same level as
> the `docker-compose.production.yml` file.

1. Start the application with:

```
docker-compose -f docker-compose.production.yml up --build -d
```

> To override an `.env` variable you can do `SOME_VAR=12345 docker-compose -f docker-compose.production.yml up --build -d`

When you look at the running Docker containers using `docker ps`, you should see a container named `yhsi_web_1`.

**One thing to keep in mind is that the port in the `docker-compose.prodution.yml` may need to be changed
depending the the reverse proxy setups.**
