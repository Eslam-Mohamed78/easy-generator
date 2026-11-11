# Deploying to Vercel

The stack is already live:

| Project | URL |
| --- | --- |
| `easy-generator-api` | https://easy-generator-api-eslam-mohamed.vercel.app (Swagger at `/api`) |
| `easy-generator-web` | https://easy-generator-web-eslam-mohamed.vercel.app |

MongoDB is hosted on MongoDB Atlas (`MONGO_URI` stored as an encrypted env var on the API project). Both projects are Git-based: every push to `main` auto-deploys them. The Docker-based local flow (`docker compose up --build`) remains supported and documented in the README.

## Project setup reference

Use this when redeploying or recreating from scratch. Both apps deploy from this single GitHub repo as two separate Vercel projects, built from the repo root via the per-app `vercel.json` in `apps/api` and `apps/web` (works around npm workspaces not being installed under the Vercel project's root directory).

### API (`easy-generator-api`)

- **Root Directory**: `apps/api` — enable "include files outside the root directory" when prompted (npm workspaces).
- Framework: NestJS is detected automatically (zero config).
- Environment variables:

| Name | Value |
| --- | --- |
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET` | any long random string (e.g. `openssl rand -hex 32`) |
| `CORS_ORIGIN` | the web app's URL |
| `RUN_SEED_ON_START` | `false` (Vercel functions don't run the Docker entrypoint) |

### Web (`easy-generator-web`)

- **Root Directory**: `apps/web`.
- Framework: Vite is detected automatically.
- Environment variable: `VITE_API_URL` = the API URL (no trailing slash).

### Seeding demo users

With `RUN_SEED_ON_START=false`, seed by hitting signup once:

```bash
curl -X POST https://easy-generator-api-eslam-mohamed.vercel.app/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","name":"Demo User","password":"Str0ng!Pass1"}'
```

## Verify

- Open the web URL → `/signup`, create an account → lands on the app page.
- `GET /me` without a token must return `401`.
- Swagger: https://easy-generator-api-eslam-mohamed.vercel.app/api

## Troubleshooting / notes

- npm workspaces at the Vercel project level failed on the first deploy; the per-app `vercel.json` files run install/build commands from the repo root to fix this.
- The API runs as a single Vercel Function (Fluid compute). No Docker on Vercel — the Dockerfiles are for local `docker compose up`.
- Vercel functions don't "wait for mongo" like the Docker entrypoint; Atlas' free tier is fine as long as the connection string and network access are set.
- If the API cold-starts slowly on the first request, that's normal on the Hobby plan.
