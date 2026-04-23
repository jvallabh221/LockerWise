# LockerApp-Merged

Both applications are now in one place:

- `frontend` (React + Vite)
- `backend` (Node + Express)

## Setup

1. Install dependencies:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
2. Create env files:
   - `frontend/.env` from `frontend/.env.example`
   - `backend/.env` from `backend/.env.example`
3. Update backend `.env` values (`DBURL`, `JWT_SECRET`, mail settings, etc.).

## Run both

From this root folder:

`powershell -ExecutionPolicy Bypass -File .\start-fullstack.ps1`
