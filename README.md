# LockerWise

Full-stack locker management app:

- `frontend` (React + Vite)
- `backend` (Node + Express + MongoDB)

In production, the backend serves the built frontend, so **it deploys as one service**.

## Local development

1. Install everything:

   ```
   npm run build
   ```

   (this installs `backend` and `frontend` deps, then builds the frontend)

2. Create env files:
   - `backend/.env` from `backend/.env.example`
   - `frontend/.env` from `frontend/.env.example` (only needed for local `vite dev`)

3. Run both apps (separate dev servers):

   ```
   npm run dev
   ```

   Frontend: http://localhost:5173  
   Backend:  http://localhost:5000

## Production (single service)

Build, then start the backend which also serves `frontend/dist`:

```
npm run build
npm start
```

Open: http://localhost:5000

## Deploy on Railway (one service)

1. Create a Railway project from this GitHub repo.
2. In service **Settings**:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
3. Add env vars under the **Variables** tab:
   - `DBURL`
   - `JWT_SECRET`
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `FROM_EMAIL`
   - `IMG_LINK` (optional)
   - `CORS_ORIGINS` is optional (same-origin frontend needs no CORS)
4. Deploy. Railway auto-assigns `PORT` and a public URL.

That’s it — one URL serves both frontend and backend.
