# /polish-plan — Plan File Standardization

Reformat any plan file to professional, scannable standard with zero content loss. Transforms messy plans into beautifully structured documents that work for both humans and AI.

---

## Purpose

Plan files grow organically and become inconsistent—buried details, mixed formats, hard to track progress. This command applies a rigorous format standard while **guaranteeing every piece of content is preserved**.

**Output**: The same plan file, reformatted in place.

---

## Workflow

### Phase 1: Extract (CRITICAL)

Before ANY formatting, extract ALL content into a mental inventory:

```
CONTENT INVENTORY:
- [ ] Main objective/goal
- [ ] Intent (what, why, success criteria)
- [ ] All task items (completed and pending)
- [ ] All sub-tasks and nested items
- [ ] Scope boundaries (in/out of scope)
- [ ] Context, decisions, constraints
- [ ] Blockers, warnings, questions
- [ ] Links, file references, code snippets
- [ ] Review/summary sections
- [ ] Metadata (dates, status)
- [ ] ANY other text (comments, asides, etc.)
```

**Rule**: If it exists in the original, it MUST appear in the output. No exceptions.

### Phase 2: Structure

Organize content into the standard sections (see Format Standard below). Map each extracted item to its destination section.

### Phase 3: Format

Apply formatting rules:
- Phase-prefixed IDs for all actionable items (`P0-1`, `P1-2`, etc.)
- Consistent checkboxes: `- [ ]` pending, `- [x]` complete
- Type tags in brackets: `[feat]`, `[fix]`, `[refactor]`, `[test]`, `[docs]`, `[chore]`
- ASCII header box with status and progress bar
- File/Action lines for each task
- Proper indentation (2 spaces for nesting)

### Phase 4: Verify

**MANDATORY** before saving:

1. Count items: Original task count == New task count
2. Scan for orphans: Any content from original not in new?
3. Read both versions: Does new capture everything?

If verification fails, DO NOT save. Fix first.

---

## Format Standard

```markdown
┌─────────────────────────────────────────────────────────────────────────────┐
│  PLAN: [Title - Clear, Descriptive]                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Status: NOT STARTED | IN PROGRESS | BLOCKED | COMPLETE                    │
│  Progress: ░░░░░░░░░░░░░░░░ 0/X tasks                                       │
│  Updated: YYYY-MM-DD                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

## Objective

[One sentence. Plain language. What are we trying to achieve?]

---

## What & Why

**What we're building:**
[1-2 sentences describing the concrete deliverable]

**Why we're building it:**
[1-2 sentences on the problem this solves or value it creates]

**Success looks like:**
- [End state 1 - what does "done" look like?]
- [End state 2]
- [End state 3]

---

## Scope Boundaries

**In Scope:**
- [Item 1]
- [Item 2]

**Out of Scope:**
- [Item 1] — [Why excluded]
- [Item 2] — [Why excluded]

---

## Tasks

### Phase 0: [Phase Name]

- [ ] **P0-1** [type] Task description
  File: `src/path/to/file.ts`
  Action: [What to add/change/remove]
  - [ ] Sub-task if needed
  - [ ] Another sub-task

- [x] **P0-2** [type] Completed task — *brief outcome*

### Phase 1: [Phase Name]

- [ ] **P1-1** [type] Task description
  File: `src/path/to/file.ts`
  Action: [What to add/change/remove]

- [ ] **P1-2** [type] Task description
  Files: `src/file1.ts`, `src/file2.ts`
  Action: [What to add/change/remove]

---

## Decisions & Context

**Decisions made:**
- [Decision]: [Rationale]

**Constraints:**
- [Constraint 1]
- [Constraint 2]

---

## Blockers & Open Questions

| ID | Type | Description | Status |
|----|------|-------------|--------|
| B-001 | Blocker | Description | OPEN |
| Q-001 | Question | Description | RESOLVED: answer |

---

## Verification

```bash
pnpm typecheck && pnpm lint && pnpm test
```

---

## Review

*[Completed after all tasks done]*

**Summary:** [What was accomplished]

**Changes made:**
- [Change 1]
- [Change 2]

**Follow-up items:**
- [ ] Item for future work
```

---

## Formatting Rules

### Task IDs

- Format: `P{phase}-{number}` (Phase-prefixed)
- Sequential within phases: Phase 0 = P0-1, P0-2, P0-3; Phase 1 = P1-1, P1-2
- Blockers: `B-XXX`, Questions: `Q-XXX`

### Task Structure

Each task should include:
```markdown
- [ ] **P0-1** [type] Task description
  File: `src/path/to/file.ts`
  Action: [What to add/change/remove]
```

For multiple files:
```markdown
- [ ] **P1-1** [type] Task description
  Files: `src/file1.ts`, `src/file2.ts`
  Action: [What to add/change/remove]
```

### Type Tags

| Tag | Use For |
|-----|---------|
| `[feat]` | New functionality |
| `[fix]` | Bug fixes |
| `[refactor]` | Code restructuring |
| `[test]` | Test-related work |
| `[docs]` | Documentation |
| `[chore]` | Maintenance, config, dependencies |
| `[research]` | Investigation, exploration |
| `[design]` | Design decisions, architecture |

### Checkboxes

```markdown
- [ ] Pending task
- [x] Completed task
- [~] Partially complete / in progress (optional)
- [-] Cancelled / won't do (optional)
```

### Progress Bar

Update the progress bar in the header to reflect completion:

```
░░░░░░░░░░░░░░░░  0/10 tasks   (0%)
████░░░░░░░░░░░░  3/10 tasks   (30%)
████████████░░░░  8/10 tasks   (80%)
████████████████ 10/10 tasks   (100%)
```

### Nesting

```markdown
- [ ] **P0-1** [feat] Parent task
  File: `src/example.ts`
  Action: Implement feature
  - [ ] Sub-task (no ID, 2-space indent)
  - [ ] Another sub-task
    - [ ] Deeper nesting (4-space indent)
```

---

## Handling Special Content

### Code Snippets

Preserve exactly as-is in the `Decisions & Context` section:

```markdown
## Decisions & Context

Relevant code pattern:
\`\`\`typescript
// preserved exactly
\`\`\`
```

### Links & References

Include as inline references or in File: line:

```markdown
- [ ] **P0-1** [feat] Implement auth
  File: `src/lib/auth.ts`
  Action: Add JWT validation — see [RFC 7519](https://tools.ietf.org/html/rfc7519)
```

### Warnings & Blockers

Promote to the Blockers table if actionable.

### Freeform Text

If the original has paragraphs of context, preserve in `Decisions & Context` or `What & Why`. Never delete explanatory text.

---

## Rules

1. **Zero content loss** — Every word, link, and item from the original must appear in the output
2. **Preserve meaning** — Don't paraphrase in ways that lose nuance
3. **Consistent IDs** — All actionable items get phase-prefixed IDs
4. **Clean hierarchy** — Phases > Tasks > Sub-tasks
5. **Lead with intent** — What & Why section clarifies purpose upfront
6. **Scannable** — Someone should understand status in 5 seconds
7. **Verify before save** — Always do Phase 4

---

## Anti-Patterns

Reject impulses to:

- **Summarize away details** — If it was written, it matters
- **Skip verification** — The diff check catches mistakes
- **Invent content** — Only restructure what exists
- **Change task wording significantly** — Reformat, don't rewrite
- **Delete explanatory text** — You don't know what's important to the author
- **Skip File/Action lines** — Explicit is better than implicit

---

## Example Transformation

### Before (messy)

```markdown
# todo

- fix the bug in auth
- [x] setup project
- need to also handle edge cases
- maybe refactor later?

notes: talked to John, he said use JWT

- [ ] write tests
- deployment stuff

don't touch the payments module - out of scope
```

### After (polished)

```markdown
┌─────────────────────────────────────────────────────────────────────────────┐
│  PLAN: Auth Bug Fix & Project Setup                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Status: IN PROGRESS                                                        │
│  Progress: ██░░░░░░░░░░░░░░ 1/5 tasks                                       │
│  Updated: 2024-01-15                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

## Objective

Fix authentication bug and complete remaining project setup tasks.

---

## What & Why

**What we're building:**
A patch to the auth system that fixes the login bug, plus completing remaining setup tasks.

**Why we're building it:**
Users are experiencing authentication failures that block access to the application.

**Success looks like:**
- Auth bug is fixed and edge cases handled
- Tests verify the fix works
- Project is deployed and running

---

## Scope Boundaries

**In Scope:**
- Auth bug fix
- Edge case handling
- Test coverage
- Deployment

**Out of Scope:**
- Payments module — not related to this fix

---

## Tasks

### Phase 0: Core Fixes

- [ ] **P0-1** [fix] Fix the bug in auth
  File: `src/lib/auth.ts`
  Action: Patch token validation logic
  - [ ] Handle edge cases

- [x] **P0-2** [chore] Setup project — *completed*

### Phase 1: Quality & Deployment

- [ ] **P1-1** [test] Write tests
  File: `tests/unit/auth.test.ts`
  Action: Add test cases for auth fix

- [ ] **P1-2** [chore] Deployment stuff
  File: `vercel.json`
  Action: Configure deployment

- [ ] **P1-3** [refactor] Maybe refactor later? *(flagged as uncertain)*

---

## Decisions & Context

**Decisions made:**
- Use JWT for auth (per conversation with John)

---

## Blockers & Open Questions

| ID | Type | Description | Status |
|----|------|-------------|--------|
| - | - | No blockers | - |

---

## Verification

```bash
pnpm typecheck && pnpm lint && pnpm test
```

---

## Review

*[To be completed]*
```

---

## When NOT to Use

- Creating a new plan from scratch → just write it in the standard format
- The plan is already well-formatted → don't churn
- You need to significantly change the plan content → make edits first, then polish

---

## Quick Reference

```
/polish-plan [path]     # Polish specific file
/polish-plan            # Polish tasks/todo.md (default)
```

**Phases**: Extract → Structure → Format → Verify

**Guarantee**: Zero content loss, every time.
