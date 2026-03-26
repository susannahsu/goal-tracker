# Goal Tracker — Setup Guide

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your Vercel Postgres connection string (see step 4 for how to get it).

### 3. Deploy to Vercel & create database

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. In your Vercel project → **Storage** tab → **Create Database** → choose **Postgres**
4. After creation, go to **Storage** → your DB → **.env.local** tab → copy all env vars into your local `.env.local`

### 4. Push schema to database
```bash
npm run db:push
```
This creates the `goals` table with proper indexes.

### 5. (Optional) Seed with sample data
```bash
npm run db:seed
```
Populates the database with Fluidstack's strategic goals from the prototype.

### 6. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment

Vercel auto-deploys on push to `main`. The `POSTGRES_URL` env var is automatically available to your deployed app.

## Database Commands
| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to DB (no migration files) |
| `npm run db:generate` | Generate SQL migration files |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |
| `npm run db:seed` | Seed with sample data |

---

## Architecture

```
src/
  app/
    page.tsx           Server Component — fetches goals, renders GoalTracker
    layout.tsx         App shell
    globals.css        Dark theme CSS
  components/
    GoalTracker.tsx    Client orchestrator — tabs, filters, modal state
    GoalsTable.tsx     Table view with inline status editing
    WaterfallView.tsx  Visual hierarchy view
    AddGoalModal.tsx   Add goal form
    StatusBadge.tsx    Colored status indicator
  lib/
    schema.ts          Drizzle ORM schema (goals table)
    db.ts              Vercel Postgres connection
    actions.ts         Server Actions for CRUD
    types.ts           Shared TypeScript types
scripts/
  seed.ts              One-time data seeder
drizzle.config.ts      Drizzle Kit config
```

## Scalability Notes

- **Database**: Vercel Postgres (Neon) scales automatically — handles thousands of concurrent connections via connection pooling
- **Indexes**: `level`, `parent_id`, `status`, `team` are all indexed for fast filtering
- **Server Actions**: Used for mutations — avoids a separate API layer, reduces latency
- **Auth (not yet added)**: Recommend adding [Clerk](https://clerk.com) or [Auth.js](https://authjs.dev) with SSO/SAML for 1000+ employees

## Adding Authentication (when ready)

The recommended path for 1000+ employees:
1. Install Clerk: `npm install @clerk/nextjs`
2. Wrap the app in `<ClerkProvider>`
3. Protect the route in `middleware.ts`
4. Optionally add `user_id` / `organization_id` columns to the goals table for ownership filtering
