# Copilot instructions

- 和这个项目有关的问答都用中文回答。

## Project shape
- Monorepo with React/Vite frontend in [client](client) and Express/Prisma backend in [server](server).
- Frontend entry is [client/src/main.jsx](client/src/main.jsx); primary UI and filtering logic live in [client/src/App.jsx](client/src/App.jsx).
- MUI theme customizations are centralized in [client/src/theme.js](client/src/theme.js).
- Backend API is implemented in [server/index.js](server/index.js) with Prisma models in [server/prisma/schema.prisma](server/prisma/schema.prisma).

## Data flow and sources
- SQLite + Prisma is the system of record; seed scripts are in [server/seed.js](server/seed.js) and [server/seed_engines_manual.js](server/seed_engines_manual.js).
- Static mode is supported: `npm run export` in [server/package.json](server/package.json) writes JSON into [client/src/data](client/src/data).
- Frontend currently loads rockets via a dynamic import of [client/src/data/rockets.json](client/src/data/rockets.json) and engines via a static import of [client/src/data/engines.json](client/src/data/engines.json).
- `imageUrl` fields may be a JSON-encoded array or a plain string; UI handles both in [client/src/App.jsx](client/src/App.jsx) and [client/src/components/EngineDetailModal.jsx](client/src/components/EngineDetailModal.jsx).

## APIs and integration points
- Rockets list endpoint is `GET /api/rockets` with filters (search, country, min/max LEO, fuel, stages, status, manufacturer, isReusable) defined in [server/index.js](server/index.js).
- Engines endpoints are `GET /api/engines` and `GET /api/engines/:name` in [server/index.js](server/index.js); detail responses may include `relatedRockets`.
- The server serves local image assets at `/images` from [pic](pic); see the static mount in [server/index.js](server/index.js).

## Developer workflows
- Backend setup: `cd server`, `npm install`, `npx prisma db push`, `npm run seed`.
- Backend dev: `cd server`, `npm run dev` (or `npm start`).
- Frontend dev: `cd client`, `npm install`, `npm run dev`.
- Frontend build: `cd client`, `npm run build`.
- Windows shortcut to run app: [start.bat](start.bat).

## Project-specific conventions
- Image names must match the `name` fields and can be multi-image sets using `Name(2).jpg` style; see [README.md](README.md).
- Prefer updating the Prisma schema and re-exporting static JSON instead of hand-editing [client/src/data](client/src/data).
