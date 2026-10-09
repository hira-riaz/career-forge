# Project Overview: CareerForge

## Executive Summary
CareerForge is an AI-native professional optimization pipeline and interactive career acceleration suite. Instead of simple text editors, the platform operates as a technical workbench where developers, engineers, and professionals feed their background data into an AI orchestration engine. The platform systematically transforms raw experience records into tailored technical resumes, creates targeted cover profiles, maps dynamic multi-step career graphs, and spins up interactive background execution loops for mock interview simulations.

## Project Goals
1. Securely authenticate users and enforce absolute data isolation across individual profile, resume, and application tracking spaces.
2. Provide a clean, highly responsive multi-tab workspace dashboard for switching between document tailoring, interactive path mapping, and interview logging.
3. Utilize durable, long-running asynchronous background agents to process multi-stage AI tasks (e.g., matching a deep resume schema against a hyper-specific technical job description).
4. Export flawlessly structured, compiled professional artifacts into various download streams (Markdown profiles, clean PDFs, and portable structural JSON schemas).

## Core User Flow
1. **Gatekeeping & Identity:** Unauthenticated traffic is safely caught by Next.js application route wrappers and channeled to a secure, minimal multi-panel auth screen.
2. **The Forge Dashboard:** Authenticated users land on a central control hub displaying active application pipelines, targeted document sets, and custom interview histories.
3. **Tailoring Workspace:** Users enter a multi-column workspace interface containing raw historical data side-by-side with an interactive editor view and an AI agent control sidebar.
4. **Agent-Driven Synthesis:** Users trigger specialized background worker threads that parse incoming target roles, apply contextual improvements, and update structural data fields in real-time.
5. **Asset Export:** Users preview tailored assets via markdown rendering sheets and trigger secure download actions to fetch final deployment artifacts.

## Scope Definitions
### In-Scope (Phase 1 Baseline)
- Multi-tab application layout with collapsible sidebar menus and sticky control panels.
- Profile metadata model managing structural experience nodes, technology tags, and targeted career objectives.
- Asynchronous AI tailoring framework isolating heavy optimization loops from short-lived client HTTP endpoints.
- Persistent automatic backup mechanisms tracking state mutations to cloud drives on structural profile updates.

### Out-of-Scope (Future Enhancements)
- Multi-tenant enterprise business account tracking or native corporate seat setups.
- Real-time video/audio stream rendering tracks for face-to-face mock interview analysis.
- Live scraping hooks navigating third-party job site frameworks outside direct user copy-paste schemas.
