# LockerWise

Full-stack locker management app:

- `frontend` (React + Vite)
- `backend` (Node + Express + MongoDB)

In production, the backend serves the built frontend, so **it deploys as one service**.  
In development, Vite proxies `/api` to Express, so the browser sees **one URL**.

## One-time setup

```
npm install
npm run install:all
```

Create `backend/.env` from `backend/.env.example` and fill in values.

## Run (one command)

```
npm run dev
```

Open: http://localhost:5173  
Backend runs on http://localhost:5000 (used internally via Vite proxy).

## Production build

```
npm run build
npm start
```

Open: http://localhost:5000 (backend serves built frontend)

## Deploy on Railway (one service)

1. Create Railway project from this GitHub repo.
2. In service **Settings**:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
3. Add env vars under **Variables**:
   - `DBURL`
   - `JWT_SECRET`
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `FROM_EMAIL`
   - `IMG_LINK` (optional)
4. Deploy. Railway auto-assigns `PORT` and a public URL — one URL serves both frontend and API.

## Migrations

Schema changes are managed by [migrate-mongo](https://github.com/seppevs/migrate-mongo).
Never edit the database directly.

From `backend/`:

```
npm run migrate:status             # list migrations and their state
npm run migrate:up                 # apply all pending migrations
npm run migrate:down               # roll back the most recent migration
npm run migrate:create <name>      # scaffold a new migration file
```

Migrations are **human-gated**: they are never auto-run on deploy, and they are
never executed as part of the app's startup code. Run them explicitly from a
shell with the correct `DBURL` set. Typical targets:

- **Local dev DB:** `DBURL=mongodb://localhost:27017/lockerwise_dev`
- **Staging:** the staging `DBURL` from the staging service's variables
- **Production:** run from the Railway production service's Shell tab so the
  URL comes from that service's own env; do not copy production credentials
  onto a dev machine

**Two-step rule:** never drop a field or collection in the same migration that
removes references to it. Pattern: add new → migrate data → deploy → remove
old in a later migration.

**Verification:** `node scripts/verifyMigrations.js` drives the full
status → up → status → down → status cycle against an ephemeral in-memory
MongoDB. Every migration PR in Phase 1 runs this script and quotes its output
in the PR description. The script never connects to a real database.

## Create the first Admin

The app has no default admin. After the DB is reachable (locally or on Railway), seed one:

```
cd backend
ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD='Strong!Pass1' npm run seed:admin
```

Optional vars: `ADMIN_NAME`, `ADMIN_PHONE`, `ADMIN_GENDER` (`Male`|`Female`|`Other`).  
Set `ADMIN_RESET=true` to overwrite the password of an existing admin with the same email.

On Railway, run the same command from the backend service's **Shell** tab — it reuses the app's `DBURL` automatically.
