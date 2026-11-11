# Easy Generator — Full-Stack Auth Task

A production-style authentication module: **NestJS + MongoDB** API and a **React + TypeScript** front-end, dockerized with an automatic data-seeding flow.

## What's inside

| App | Path | Stack |
| --- | --- | --- |
| API | `apps/api` | NestJS 11, Mongoose, JWT (passport-jwt), Swagger, Jest |
| Web | `apps/web` | Vite, React 18, Tailwind CSS, react-hook-form + zod, Vitest |

### Features
- **Signup / Signin** with full field validation (email format, name ≥ 3 chars, password with letter + number + special char, min 8) — enforced on **both** client (zod) and server (class-validator).
- **Protected endpoint** `GET /me` (JWT bearer guard) and a protected application page.
- Passwords hashed with bcrypt; the hash field is excluded from queries by default.
- Global validation pipe, structured error responses, Helmet security headers, CORS config.
- Swagger docs at `/api` on the API server.
- **Idempotent data seeding** — demo users are created from env config, runnable manually or automatically at Docker startup. Safe to run repeatedly; never seeds in production by default.
- Bonus: unit tests (API + web), Dockerized full stack, GitHub Actions CI.

## Quick start (Docker — recommended)

```bash
docker compose up --build
```

- Web UI: http://localhost:8080
- API: http://localhost:3001 (Swagger: http://localhost:3001/api)

The API container waits for MongoDB health, auto-seeds demo users, then starts. Repeat runs skip already-seeded users.

**Seeded demo account:**
```
email:    demo@example.com
password: Str0ng!Pass1
```

Seed users are configurable via the `SEED_USERS` env var (JSON array of `{email, name, password}`).

## Local development (without Docker)

Requires Node 22+ and a local MongoDB (`mongodb://localhost:27017`).

```bash
# terminal 1 — API
npm install
cp apps/api/.env.example apps/api/.env
npm run api:dev

# optional: seed demo users
npm run api:seed

# terminal 2 — Web (proxies /api → localhost:3001)
npm run web:dev
```

Web UI: http://localhost:5173

## Environment variables (`apps/api/.env`)

| Var | Purpose |
| --- | --- |
| `PORT` | API port (default 3001) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret — set a strong value outside dev |
| `CORS_ORIGIN` | Allowed browser origin |
| `RUN_SEED_ON_START` | `true` → entrypoint runs the seeder (disabled automatically in production) |
| `SEED_USERS` | JSON array of users to seed |

## API overview

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/signup` | — | Create account, returns `{ accessToken, user }` |
| POST | `/auth/signin` | — | Issue JWT for valid credentials |
| GET | `/me` | Bearer JWT | Current user (protected) |

Interactive docs: `http://localhost:3001/api` when the API is running.

## Tests

```bash
npm test            # API + web test suites
npm run typecheck   # TypeScript across both apps
```

## CI

GitHub Actions runs install → typecheck → tests on every push (see `.github/workflows/ci.yml`).

## Author

**Eslam Mohamed** — Full Stack Engineer (TypeScript / NestJS / React)
[github.com/Eslam-Mohamed78](https://github.com/Eslam-Mohamed78) · [eslammohamed.vercel.app](https://eslammohamed.vercel.app)
