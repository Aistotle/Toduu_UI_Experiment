# Phase X — Overflow & Discovered Tasks

**Status:** Pending | In Progress | Complete

---

## Purpose

Capture tasks discovered during implementation that don't fit existing phases. This phase is for:

- Bugs discovered that block progress
- Refactoring opportunities identified mid-implementation
- Dependency issues requiring unplanned work
- Edge cases discovered that need addressing
- Technical debt that must be resolved

---

## When to Add Tasks Here

Add a batch to Phase X when:

1. **Blocker discovered** — Something prevents completing a planned batch
2. **Scope gap** — Planned batches missed something essential
3. **Refactoring needed** — Code changes revealed a better approach
4. **Bug fix** — A bug was discovered that must be fixed before continuing

Always reference which phase/batch discovered the issue.

---

## Entry Criteria

Phase X can be worked on at any time when:

- [ ] A blocking issue is discovered
- [ ] The issue doesn't fit cleanly in existing phases
- [ ] Continuing without resolution would cause problems

---

## Exit Criteria

Before marking Phase X complete:

- [ ] All blocking PX batches resolved
- [ ] Non-blocking PX batches triaged for future work
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes

---

## Batches

| Batch | File | Description | Discovered In | Blocking? |
|-------|------|-------------|---------------|-----------|
| PX-A | `PX-A-fix-name.md` | [Description] | Phase [N] | Yes/No |

---

## Template for PX Batches

```markdown
# PX-A: [Fix/Issue Name]

**Discovered in:** Phase [N], Batch [PN-X]
**Blocking:** Yes / No
**Priority:** High / Medium / Low

## Context

[What led to discovering this issue]

## Tasks

- [ ] **PX-1**: [Task description]
  File: `src/path/to/file.ts`
  Action: [What to fix]

## Verification

[How to verify the fix]
```

---

## Rules

1. Always reference which phase discovered the issue
2. Mark as blocking or non-blocking
3. Prioritize blocking issues immediately
4. Non-blocking issues can wait until after main phases
