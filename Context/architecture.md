# System Architecture

## Production Tech Stack
- **Framework Core:** Next.js 16 App Router & React 19 production baseline.
- **Identity Layer:** Clerk Next.js SDK (`@clerk/nextjs`) with a root `ClerkProvider` and `clerkMiddleware` configured in the Next.js 16 `proxy.ts` entry point. Application routes are protected by default; only `/sign-in` and `/sign-up` are public.
- **State Broker:** React Context Providers managing shared document models and mutation events.
- **Relational Layer:** Postgres database clusters accessed through Prisma ORM schemas.
- **Durable Compute:** Trigger.dev task workers with typed realtime status streams and Prisma-persisted state transitions.
- **Object Storage:** Vercel Blob private authenticated snapshot/result storage; Postgres stores URL references rather than document content.
- **AI Core:** Vercel AI SDK with the Google provider and Gemini 2.5 Flash structured tool calling, validated with Zod.

## Data Persistence Blueprint
To guarantee blazing fast document updates and prevent relational table bloating under heavy text processing volumes, CareerForge enforces a strict hybrid persistence architecture:
1. **Postgres Metadata Control:** The relational layer tracks system-level markers only (user profiles, target job metadata records, background generation logs, artifact URL links).
2. **Blob Storage Asset Isolation:** Large text fragments, complete JSON resume state arrays, and final generated spec sheets write directly to private Vercel Blob storage buckets.
3. **URL Ref referencing:** Prisma queries load rapid database references pointing to secure Vercel Blob asset endpoints, keeping internal system joins ultra-lean.

## System Scoping Boundaries
- **Server-Side Security Enforcement:** All validation logic and ownership permissions evaluate directly at the API route handler boundary before execution hooks call the Postgres or Blob layer.
- **Identity Enforcement:** Clerk proxy middleware protects application routes by default. Server layouts and route handlers must verify the authenticated user before rendering protected client components or accessing user-owned data.
- **Isolated Generative Workers:** Long-running AI processing calls must never run within standard Next.js request loops. Next.js API endpoints strictly validate data, fire durable background tasks inside Trigger.dev, and return immediate task IDs to avoid unexpected client timeouts.
- **Worker Persistence:** Optimization status/signal changes are written atomically to the task row before realtime events are emitted. Completed resume documents are stored in private Vercel Blob storage, and only the returned blob URL is persisted in Postgres.
