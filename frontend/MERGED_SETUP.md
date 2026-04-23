# Frontend + Backend Merged Setup

This setup keeps your frontend and backend in separate folders but runs them as one integrated app locally.

## Folder locations expected

- Frontend: `C:\Users\C3TS Learning Hub\Downloads\Frontend_Test-master\Frontend_Test-master`
- Backend: `C:\Users\C3TS Learning Hub\Downloads\Backend_Test-main\Backend_Test-main`

## One-time setup

1. Install frontend dependencies:
   - Open terminal in frontend folder and run: `npm install`
2. Install backend dependencies:
   - Open terminal in backend folder and run: `npm install`
3. Create env files:
   - Frontend: copy `.env.example` to `.env`
   - Backend: copy `.env.example` to `.env`
4. Update backend `.env` values for your MongoDB and mail settings.

## Run both together

From frontend folder run:

`powershell -ExecutionPolicy Bypass -File .\start-fullstack.ps1`

This opens two PowerShell windows:
- Backend (`npm run dev`)
- Frontend (`npm run dev`)

## API connection

- Frontend uses: `VITE_BACKEND_URL=http://localhost:5000/api`
- Backend accepts local frontend origin: `http://localhost:5173`
