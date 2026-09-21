# Logbook

This folder is the handoff point for this project. It exists so that any
future session, human or Claude, can pick up work on the Monkey Media
website without re-deriving context from scratch.

## Files in this folder

- **PROJECT-OVERVIEW.md** — what the site is, how it's built, every page and
  component, the design system, and animation conventions. Read this first
  to understand the codebase.
- **DEPLOYMENT.md** — how the site gets from a local commit to
  `monkeymedia.agency`, including the GitHub/Vercel setup and known gotchas
  that have already burned us once (don't rediscover these the hard way).
- **CHANGELOG.md** — a dated, newest-first log of every notable change,
  tied to git commit hashes.

## How to use this with Claude

If you're starting a new Claude Code (or Claude chat) session on this
project, point it at this folder first — e.g. "read logbook/ before we
start." That gets it current on the site's structure, the deployment
quirks, and what's changed recently, without re-reading the whole
repository or re-learning things the hard way (like the SSH passphrase or
the Vercel auto-deploy gap in DEPLOYMENT.md).

## Keeping it current

This folder is only useful if it stays accurate. Whenever a future session
makes a notable change to the site:

1. Add an entry to the top of **CHANGELOG.md** (date, one-line summary,
   commit hash once committed).
2. If the change adds/removes a page, component, route, or shifts the
   design system, update the relevant section of **PROJECT-OVERVIEW.md**.
3. If the change touches how the site is deployed or hosted, update
   **DEPLOYMENT.md**.

Small copy tweaks don't need a PROJECT-OVERVIEW.md update — just a
CHANGELOG.md entry is enough.
