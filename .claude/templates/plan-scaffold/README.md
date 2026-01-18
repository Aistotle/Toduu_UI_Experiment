# [Project Name] — Plan Hub

**Status:** Active | Complete | Archived
**Created:** [Date]
**Owner:** [Name]

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [DASHBOARD.md](./DASHBOARD.md) | Progress at a glance (auto-generated) |
| [what_and_why.md](./what_and_why.md) | Summary + Specification (source of truth) |
| [glossary.md](./glossary.md) | Domain terminology definitions |
| [HELPER.md](./HELPER.md) | Project-specific tools and helpers |
| [PROMPT_CODER.md](./PROMPT_CODER.md) | AI coder session prompt |
| [PROMPT_REVIEWER.md](./PROMPT_REVIEWER.md) | AI reviewer session prompt |
| [batches/](./batches/) | Phase folders with task files |

---

## How to Use This Plan

### For Humans

1. Check **DASHBOARD.md** for progress at a glance
2. Read **what_and_why.md** Part 1 for the executive summary
3. Dive into **batches/** for detailed task status

### For AI Agents

1. Copy **PROMPT_CODER.md** as your starting prompt
2. Update the "Assigned Batch" section with your specific batch file(s)
3. Read the **context.md** in your assigned phase folder
4. Follow the workflow in the prompt

---

## Phase Overview

| Phase | Purpose | Status |
|-------|---------|--------|
| [Phase 0](./batches/phase-0/) | Foundation | Pending |
| [Phase 1](./batches/phase-1/) | Core Implementation | Pending |
| [Phase 2](./batches/phase-2/) | Polish & Hardening | Pending |
| [Phase X](./batches/phase-x/) | Overflow / Discovered | Pending |

---

## Quick Commands

```bash
# Verify changes
pnpm typecheck && pnpm lint && pnpm test

# Update dashboard (after completing tasks)
./scripts/update-dashboard.sh

# Start dev server
pnpm dev
```
