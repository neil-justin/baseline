<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Collaboration rule (standing, user-mandated 2026-10-28)

The user participates in **every** planning decision: each feature, its functionality, its content, and all technical choices (tools, libraries, deployment, infrastructure). Nothing gets decided unilaterally — the agent proposes options with tradeoffs, the user decides, then the decision is recorded. Treat proposals (mockups, architecture drafts, catalog content) as non-authoritative until the user signs off.

**Dependency rule (user-mandated 2026-10-28):** before installing any dependency, verify it is the latest **stable** version against the npm registry (`npm view <pkg> version` / dist-tags — `latest` must not be a prerelease); report the check alongside the install. Pre-existing deps found outdated are surfaced to the user, never bumped unilaterally.

**Parallel-work rule (user-mandated 2026-10-28):** isolate executable work streams in subagents so the interactive session stays free for planning with the user. Long builds run in background agents with self-contained briefs; the interactive session keeps the decision-making, the records, and the planning rounds.
