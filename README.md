## Dev Logs App

A personal developer productivity dashboard (MERN) for daily activity logging, todos, notes, Pomodoro tracking, weekly reviews, and GitHub contribution insights. Frontend is built with React + Vite + Tailwind v4; backend is Express + MongoDB + JWT, with Cloudinary for profile image uploads. Configured for Vercel deployment with a single `vercel.json` routing both frontend and backend.

### Monorepo layout

- `backend/`: Express API, MongoDB models, services, and middleware
- `frontend/`: React app (Vite, Redux Toolkit, Tailwind v4)
- `vercel.json`: Routes `/api/*` → backend, everything else → frontend `index.html`

### Features

- **Auth**: Email/password with JWT access/refresh tokens and automatic refresh via headers
- **Logs**: Daily entries with tags, stats and charts
- **Todos**: CRUD with filtering and drag-and-drop (Pangea DnD)
- **Notes**: Simple CRUD notes
- **Pomodoro**: Session logging, history, and aggregate stats
- **Weekly Reviews**: CRUD
- **GitHub**: Contribution calendar, streaks, stars, total contributions (user-provided PAT)

---

## Quick start

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or hosted)
- Cloudinary account (for profile image uploads)

### 1) Backend env

Create `backend/.env` with:

```bash
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/devlogs
JWT_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me

# CORS for production (comma-separated origins not supported; use single origin or array via code)
FRONTEND_URL=https://your-frontend.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:

- GitHub integration uses per-user fields (`githubUsername`, `githubToken`) stored in the user profile; no server env var required.

### 2) Frontend env (optional)

Create `frontend/.env` if you want to override defaults:

```bash
VITE_API_URL=http://localhost:5001/api
```

If not set:

- Dev uses `http://localhost:5001/api`
- Prod falls back to `https://dev-logs-backend.vercel.app/api` (customize as needed)

### 3) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4) Run locally

- Backend: `cd backend && npm run start:dev` (http://localhost:5001)
- Frontend: `cd frontend && npm run dev` (http://localhost:5173)

Login/register from the UI. Auth headers are handled automatically by the frontend.

---

## API overview

Base URL: `http://localhost:5001/api`

### Auth and headers

- `Authorization: Bearer <accessToken>`
- `x-refresh-token: <refreshToken>` (optional; if access token expired, server responds with `x-new-access-token`)

### Users

- `POST /users/register` — body: `{ name, email, password }`
- `POST /users/login` — body: `{ email, password }`
- `GET /users/profile` — auth required
- `PUT /users/profile` — auth required; supports `multipart/form-data` with `profileImage`

### Logs

- `GET /logs` — query: `?tags=a,b`
- `POST /logs` — body: `{ entry, date, tags }`
- `PUT /logs/:id`
- `DELETE /logs/:id`
- `GET /logs/stats`

### Todos

- `GET /todos`
- `POST /todos`
- `GET /todos/:id`
- `PUT /todos/:id`
- `DELETE /todos/:id`

### Notes

- `GET /notes`
- `POST /notes`
- `GET /notes/:id`
- `PUT /notes/:id`
- `DELETE /notes/:id`

### Pomodoros

- `POST /pomodoros`
- `GET /pomodoros/stats`
- `GET /pomodoros/history`

### Reviews

- `GET /reviews`
- `POST /reviews`
- `PUT /reviews/:id`
- `DELETE /reviews/:id`

### GitHub

- `GET /github/contributions` — auth required; uses user profile fields `githubUsername` and `githubToken` (GitHub GraphQL PAT)

---

## Frontend

- Vite + React 19 + Redux Toolkit
- Tailwind CSS v4 (via `@tailwindcss/vite`)

Scripts (`frontend/package.json`):

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — run ESLint

## Backend

- Express 5 + Mongoose 8
- JWT auth with refresh token rotation via headers
- CORS configured for dev and `FRONTEND_URL` in production
- Rate limiting: 100 requests per 15 minutes on `/api`
- Cloudinary + Multer for image uploads

Scripts (`backend/package.json`):

- `npm start` — start server
- `npm run start:dev` — start with nodemon

Utilities:

- Reset database (DANGEROUS): `node backend/api/utils/resetDB.js` (uses `backend/.env`)

---

## Deployment (Vercel)

The root `vercel.json` builds and routes both apps:

- Build frontend with `@vercel/static-build` (`frontend/` → `dist/`)
- Serve API via `@vercel/node` (`backend/server.js`)
- Routes:
  - `/api/(.*)` → `backend/server.js`
  - `/(.*)` → `index.html`

On Vercel, set environment variables for the backend scope:

- `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `CLOUDINARY_*`
- `FRONTEND_URL` (your deployed frontend origin)

Optionally set `VITE_API_URL` in frontend environment to your deployed API URL (e.g., `https://<your-app>.vercel.app/api`).

---

## Tech stack

- React, Vite, Redux Toolkit, Tailwind CSS v4, React Router DOM v7
- Node.js, Express 5, Mongoose 8, JWT, Multer, Cloudinary
- Axios, date-fns, framer-motion, @hello-pangea/dnd

---

## Notes

- When running locally, ensure the backend (`5001`) is up before the frontend dev server (`5173`).
- Image uploads require valid Cloudinary credentials; otherwise profile image updates will fail.
- GitHub insights require setting your GitHub username and a GraphQL PAT in your user profile within the app.
