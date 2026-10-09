# System Architecture

## Production Tech Stack
- **Framework Core:** Next.js (App Router Blueprint) & React 19 Production baseline.
- **Identity Layer:** Clerk Next.js Authentication SDK configured with custom dark variants.
- **State Broker:** React Context Providers managing shared document models and mutation events.
- **Relational Layer:** Postgres database clusters accessed through Prisma ORM schemas.
- **Durable Compute:** Trigger.dev background workers managing complex AI transformation loops.
- **Object Storage:** Vercel Blob private authenticated structural snapshot drives.
- **AI Core:** Google Gemini Pro / Flash 2.5 generative text engine networks.

## Data Persistence Blueprint
To guarantee blazing fast document updates and prevent relational table bloating under heavy text processing volumes, CareerForge enforces a strict hybrid persistence architecture:
1. **Postgres Metadata Control:** The relational layer tracks system-level markers only (user profiles, target job metadata records, background generation logs, artifact URL links).
2. **Blob Storage Asset Isolation:** Large text fragments, complete JSON resume state arrays, and final generated spec sheets write directly to private Vercel Blob storage buckets.
3. **URL Ref referencing:** Prisma queries load rapid database references pointing to secure Vercel Blob asset endpoints, keeping internal system joins ultra-lean.

## System Scoping Boundaries
- **Server-Side Security Enforcement:** All validation logic and ownership permissions evaluate directly at the API route handler boundary before execution hooks call the Postgres or Blob layer.
- **Isolated Generative Workers:** Long-running AI processing calls must never run within standard Next.js request loops. Next.js API endpoints strictly validate data, fire durable background tasks inside Trigger.dev, and return immediate task IDs to avoid unexpected client timeouts.
