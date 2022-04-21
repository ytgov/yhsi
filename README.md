# YHSI Web Application

## Developing in this Repository

Writing code and developing in this application requires running three services:

- A local Microsoft SQL Server (2019 Linux) database running in Docker
- The server-side Node.js application written in TypeScript: `/src/api`
- The Vue.js and Vuetify based front-end: `/src/web`

---

Boot the three app services:

```bash
docker-compose -f docker-compose.development.yml up
```

Or if you have `ruby` installed

```bash
bin/dev up
```

### Legacy Development Setup

To run the database locally, you must have Docker installed as well as Docker Compose, then run the following command from the root directory:

```
docker-compose -f docker-compose.dev.yml up -d
```

This command will start SQL Server and bind it to your local machine's port 1433. When it starts the first time, the database will be empty. To load it with data, you must obtain a database backup and put it into `/db/backups/yhsi.bak` then run the follow commands:

```
docker exec -it yhsi_sql_1 bash
```

This connects you to the running SQL Server container. Once in, run the following commands to create and restore the database from the backup:

```
cd /opt/mssql-tools/bin
./sqlcmd -U sa -s localhost -P 1m5ecure! -Q "RESTORE DATABASE YHSI FROM DISK = N'/backups/yhsi.bak' WITH FILE = 1"
```

You will now have a local database with data ready for the API. To run the API, run the following commands:

```
cd src/api
npm install
cp .env .env.development
```

You must then edit the `.env.development` file with the appropriate values for the local database and authentication before starting the Node.js API with:

```
npm run start
```

The API will bind to your local machines port 3000 and be available at http://localhost:3000

Last to start is the the Vue.js web front-end. To run this, open a second terminal window at this directory and run the following commands:

```
cd src/web
npm install
npm run start
```

You will now have the Vue CLI server hosting the application at http://localhost:8080 and you can begin editing the API or front-end code. **All changes to the files in the `src/api` and `src/web` will automatically reload theie respective applications.**

## Local Testing

Currently there is very minimal support for testing.
Only `src/api` has a test suite.
**The development and test databases are shared, so don't write tests that change database state yet.**

To boot the test suite go to the top level of the app and run:

```
bin/dev test up

# or if you don't have ruby
docker-compose -f docker-cmpose.test.yml up

# or if you don't have docker
cd src/api
npm install
npm run test
```

The `bin/dev test` command supports the full suite of "dev" and "docker-compose" commands.

e.g.
`dev up` will boot the app in development mode.
`dev test up` will boot the app in test mode.
`dev down` will stop the app in development mode.
`dev test down` will stop the app in test mode.

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

2. Make the file executable vai `chmod +x .git/hooks/pre-commit`

## Running the application production

Since the database for this system is managed externally, PRODUCTION version only needs to run the API and Web services.
The `Dockerfile` in this directory builds the Vue.js web front-end, and serves the compiled files via the Node.js API,
so only one container is required to serve the front-end and back-ends; thus saving resources.

On the PRODUCTION server, the application is run via docker-compose, so the code needs to be cloned to the server and
the appropriate environment variables set using the following commands:

```
cp /src/api/.env /src/api/.env.production
vi /src/api/.env.production
```

You now can use vi or nano or other tool to set the environment variables before starting the application with:

```
docker-compose -f docker-compose.production.yml up --build -d
```

When you look at the running Docker containers using `docker ps`, you should see a container named `yhsi_web_1`.

```

**One thing to keep in mind is that the port in the `docker-compose.prodution.yml` may need to be changed
depending the the reverse proxy setups.**
```
