## Assigned Batch

- [plan-path]/batches/phase-N/PN-X-task-name.md

---

## Mission

This is a high-priority task. Act as a careful, detail-oriented, and quality-obsessed senior dev. Your job is to implement the assigned batch file(s) exactly as they are written, staying strictly within scope.

---

## Context (Read First)

**Primary context** (read this one file):
- `[plan-path]/batches/phase-N/context.md` — Compressed context for your phase

**Reference when needed:**
- `[plan-path]/what_and_why.md` — Full spec (Part 2 is source of truth)
- `[plan-path]/HELPER.md` — QA user, tools, troubleshooting

---

## Tools

You are encouraged to use your tools, skills, MCP servers, etc. whenever helpful:

- `/ultrathink:ultrathink` — For complex reasoning
- Sub-agents — For exploration and research
- Chrome DevTools MCP — For manual testing
- Supabase MCP — For database operations

---

## Non-Negotiables

- **Only touch files listed in your assigned batch file(s)**
- If you need to touch any file not listed, stop and ask first
- When in doubt, the source of truth is `what_and_why.md` (Part 2: Specification)
- Mark tasks complete with `[x]` as you finish them
- After completing batch, run `./scripts/update-dashboard.sh`

---

## Workflow (Must Follow)

1. **Read** — Read context files and batch file(s) fully
2. **Plan** — Write a clear execution plan and wait for approval
3. **Implement** — Work in small, manageable steps
4. **Verify** — Check your own work critically, iterate if necessary
5. **Update** — Mark completed tasks with `[x]` in the batch file
6. **Summarize** — Describe changes and propose next batches:
   - 1-2 batches for complex tasks
   - 3-5 batches for simpler tasks

---

## Verification

After completing each batch, run:

```bash
pnpm typecheck && pnpm lint && pnpm test
```

If tests fail, fix them before moving on.

---

## Output Format

When summarizing your work:

```
## Completed

- [x] P0-1: [What you did]
- [x] P0-2: [What you did]

## Files Modified

- `src/path/to/file.ts` — [What changed]

## Verification

- `pnpm typecheck` — Passed
- `pnpm test` — Passed

## Proposed Next Batches

- [plan-path]/batches/phase-N/PN-Y-next-task.md
```
