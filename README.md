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
