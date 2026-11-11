# AI.md — How I used AI on this task

I used AI (an agentic coding assistant, Anthropic-class model) heavily throughout this repo, treating it as a pair programmer whose output I reviewed and owned. Below is an honest breakdown.

## What I used AI for

- **Planning.** I used AI to digest the PDF task, propose a stack (React+Vite+Tailwind front-end, NestJS+Mongoose+JWT back-end), and sequence the build into milestones. Prompts like "plan this task, then grill the plan for weak spots" worked well — forcing the assistant to defend choices (JWT vs session, seeding strategy) surfaced trade-offs I then decided on myself.
- **Scaffolding and boilerplate.** Nest module wiring, tsconfigs, package.json manifests, the Vite/Tailwind setup, Dockerfiles, and docker-compose were largely AI-generated. I verified every file against the actual runtime behavior rather than trusting them.
- **Form validation rules.** Generated the class-validator DTO and zod schema from the task's spec, then checked that client and server rules exactly mirrored each other (8+ chars, letter/number/special on both sides — the AI's first client-side draft only had min-length; I asked for rule parity).
- **Tests.** Unit tests for AuthService (mocked repo/bcrypt/JWT) and the signup DTO, plus zod schema tests on the front-end. AI wrote the skeletons; I fixed the mocks (Mongoose `_id` shape) when tests failed.

## What I had to correct or rework

- **JWT configuration bug.** The `JwtModule` was registered with no secret, producing `secretOrPrivateKey must have a value` at runtime. Fixed by switching to `JwtModule.registerAsync` with `ConfigService`. Lesson: AI scaffolds compile fine but silent config gaps only show up when you actually run things.
- **Dockerfile context bugs.** The AI's first Dockerfiles assumed the repo root was the `apps/*` directory, while compose used the monorepo root as the build context — `\`COPY nginx.conf\`` failed, `npm run build` was even accidentally deleted during one edit pass. I reworked both Dockerfiles for the root-context layout.
- **Docker permission/ordering bug.** `chmod` ran after `USER app`, failing the build. Moved it before switching user.
- **Seeder transport choice.** The AI's first seeder used a home-grown Mongoose bootstrap; I simplified it to a plain `mongodb` driver script — seeding shouldn't need the whole Nest DI container.
- **Test mock realism.** Two tests failed because mocked users lacked `_id.toString()`. Fixed the mocks rather than loosening the assertions.

## Judgment calls I made differently

- **Idempotent seeding, explicit opt-out in production** rather than "seed always in dev" magic — deterministic re-runs beat cleverness.
- **Same-password-error-on-signin** ("Invalid email or password") instead of distinguishing wrong-password vs unknown-user, avoiding account enumeration.
- **Dockerized against the monorepo root context** instead of per-app contexts — one `docker compose up` story in the README is worth the slightly longer COPY paths.

## What was purely human

- Deciding the milestone order, the schema/DTO shape, what "done" means for each test seam, and all trade-off decisions above. AI produced code fast; verifying it against a running stack (compose up, real curl calls against signup/signin/`/me`) is where the actual engineering happened — every bug above was caught that way, not by reading the generated code.

## AI and the Vercel deployment

The Vercel deployment itself was executed end-to-end via the Vercel MCP integration: creating both projects, setting the encrypted environment variables, and triggering the Git-based deploys from `main`. The first API deploy failed because `npm` workspaces were never installed at the Vercel project's root directory; reading the deployment event logs pinpointed the missing install, and the fix was a per-app `vercel.json` running install/build from the repo root, pushed as a single commit. The failure is a good example of AI-assisted debugging: read logs → diagnose root cause → one-commit fix, verified by the next green deploy.
