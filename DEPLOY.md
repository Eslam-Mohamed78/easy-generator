# Deploying to Vercel (no credit card needed)

Both apps deploy from this single GitHub repo as two separate Vercel projects.
MongoDB runs on MongoDB Atlas (free tier, sign in with your GitHub/Google account).

## 1. Create the database (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up with GitHub/Google.
2. Create a free **M0** cluster (no card required).
3. Database Access → add a user (or use "Connect" autofill).
4. Network Access → allow access from anywhere (`0.0.0.0/0`) — simplest for review purposes.
5. Get the connection string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/easy-generator`

## 2. Deploy the API

1. Go to https://vercel.com/new and **Import** this GitHub repo (`Eslam-Mohamed78/easy-generator`).
2. Project name: `easy-generator-api`.
3. **Root Directory**: `apps/api` — enable "include files outside the root directory" when prompted (npm workspaces).
4. Framework: NestJS is detected automatically (zero config).
5. Add Environment Variables:

| Name | Value |
| --- | --- |
| `MONGO_URI` | your Atlas connection string from step 1 |
| `JWT_SECRET` | any long random string (e.g. `openssl rand -hex 32`) |
| `CORS_ORIGIN` | `*` for now (lock down after the web app is deployed) |
| `RUN_SEED_ON_START` | `false` (Vercel functions don't run the Docker entrypoint) |

6. Deploy. Note the API URL, e.g. `https://easy-generator-api.vercel.app`.
7. Seed demo users by hitting the signup endpoint once:

```bash
curl -X POST https://<your-api>/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","name":"Demo User","password":"Str0ng!Pass1"}'
```

## 3. Deploy the web app

1. https://vercel.com/new → **Import the same repo** again.
2. Project name: `easy-generator-web`.
3. **Root Directory**: `apps/web`.
4. Framework: Vite is detected automatically.
5. Add Environment Variable:

| Name | Value |
| --- | --- |
| `VITE_API_URL` | `https://<your-api-url>` from step 2 (no trailing slash) |

6. Deploy.
7. Back to the **API project** → Settings → Environment Variables → set
   `CORS_ORIGIN` to the web app's URL (e.g. `https://easy-generator-web.vercel.app`) → Redeploy API.

## 4. Verify

- Open the web URL → `/signup`, create an account → lands on the app page.
- `GET https://<your-api>/me` without a token must return `401`.
- Swagger: `https://<your-api>/api`.

## Notes

- The API runs as a single Vercel Function (Fluid compute). No Docker needed on Vercel —
  the Dockerfiles are for local `docker compose up`.
- Vercel functions don't "wait for mongo" like the Docker entrypoint; Atlas' free tier
  is fine as long as the connection string and network access are set.
- If the API cold-starts slowly on the first request, that's normal on the Hobby plan.
