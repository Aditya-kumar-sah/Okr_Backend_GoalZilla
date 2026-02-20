
# GoalZilla — OKR Backend

A backend API for managing Objectives and Key Results (OKRs). Built with NestJS, Prisma (Postgres), and integrated with Google Gemini for AI-assisted OKR generation. Provides endpoints to create, read, update and validate Objectives and Key Results, background scheduling support, email notifications, and OpenAPI (Swagger) documentation.

**Features**
- **Objectives & Key Results API**: CRUD operations for objectives and their key results.
- **AI-assisted OKR generation**: Uses Google Gemini via `@google/genai` to generate OKRs from a user prompt.
- **Database**: PostgreSQL through Prisma with the `@prisma/adapter-pg` adapter.
- **Validation**: Request/response validation using `yup` (and `zod` utilities available).
- **OpenAPI**: Swagger docs via `@nestjs/swagger`.

**Technologies & Versions**
- **NestJS**: @nestjs/common/core/platform-express v^11.0.1
- **Prisma**: `prisma` and `@prisma/client` v^7.3.0
- **TypeScript**: ^5.7.3
- **Jest** (tests): ^30.0.0
- **Prettier**: ^3.4.2
- **ESLint**: ^9.18.0
- **Google GenAI / Gemini**: `@google/genai` ^1.41.0, `@google/generative-ai` ^0.24.1

Note: exact versions are listed in `package.json`. Use the versions there for reproducing the environment.

**Requirements**
- Node.js (recommended: 18+)
- pnpm (to install and run scripts)
- PostgreSQL (or another connection compatible with Prisma Postgres adapter)
- Environment variables: `DATABASE_URL`, `GEMINI_API_KEY` (Google Gemini), optional `PORT`

Quickstart — Clone and run locally

1. Clone the repo

```bash
git clone https://github.com/Aditya-kumar-sah/Okr_Backend_GoalZilla
cd okr-backend-goal-zilla
```

2. Install dependencies

```bash
pnpm install
you can learn about pnpm from : https://pnpm.io/motivation
```

3. Add environment variables

Create a `.env` file in the project root with the required keys (example below).

4. Generate Prisma client and apply migrations

For development (creates a development migration):

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

For running existing migrations (production-like):

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

5. Start the app

```bash
pnpm run start:dev
```

6. Open API docs

If the app runs on port 3002 (default), open: http://localhost:3002/api

**Environment example (.env)**

```
DATABASE_URL=postgresql://user:password@localhost:5432/goalzilla?schema=public
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3002
```


**Common Prisma / DB commands (via pnpm)**
- `pnpm prisma generate` — Generate Prisma client
- `pnpm prisma migrate dev` — Create & apply a new dev migration
- `pnpm prisma migrate deploy` — Apply migrations in CI/production
- `pnpm prisma db push` — Push schema state to the database (no migration files)
- `pnpm prisma studio` — Open Prisma Studio (DB GUI)

**Schema of Okr**

[![](https://mermaid.ink/img/pako:eNptUU1vwjAM_SuRzwXRL0Jzm0C7cNg07TRVQlljSqYmqZJ0Giv894UCY1uXQ2w_-9nPSQ-VEQgM0K4kry1XpSaEDBd5eH3Dyst3JIfDZHLoyRr3T-i6xhNGKqM9l9r9Le3PwOk4b6WuiRTkcX1DV9zjs1RIKovBFXd-xPDSN3hGj2dzm_xf_xEk0FVWtl4aPcqZq9RNEHb_Q9irMQ1yTaRbGtU2GLTdklJ70lpTW3TuN-q5rdFvxsnLPIXBVpdtIILaSgHM2w4jUGgVP4UwrFWC36HCElhwBW55WLiEUp9oLdcvxqgr05qu3gHb8saFqGtFeMrLD36jFrVAuzSd9sDieE6HLsB6-ABW0Gme5MWsSLIiWcRpFsE-VM3j6YwmcZJnabygWZYdI_gc5s6mNC2SPE9pltJ0ltLk-AVWU7AC?type=png)](https://mermaid.live/edit#pako:eNptUU1vwjAM_SuRzwXRL0Jzm0C7cNg07TRVQlljSqYmqZJ0Giv894UCY1uXQ2w_-9nPSQ-VEQgM0K4kry1XpSaEDBd5eH3Dyst3JIfDZHLoyRr3T-i6xhNGKqM9l9r9Le3PwOk4b6WuiRTkcX1DV9zjs1RIKovBFXd-xPDSN3hGj2dzm_xf_xEk0FVWtl4aPcqZq9RNEHb_Q9irMQ1yTaRbGtU2GLTdklJ70lpTW3TuN-q5rdFvxsnLPIXBVpdtIILaSgHM2w4jUGgVP4UwrFWC36HCElhwBW55WLiEUp9oLdcvxqgr05qu3gHb8saFqGtFeMrLD36jFrVAuzSd9sDieE6HLsB6-ABW0Gme5MWsSLIiWcRpFsE-VM3j6YwmcZJnabygWZYdI_gc5s6mNC2SPE9pltJ0ltLk-AVWU7AC)
---

