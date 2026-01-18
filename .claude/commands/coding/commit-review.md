# /commit-review — Pre-Commit Change Review

PR-style critique of uncommitted changes. Catch functional problems before they become committed history. Do not commit anything - only review uncommitted changes and show your findings to the user.

---

## Purpose

Review everything you've changed locally (staged and unstaged) against HEAD, applying adversarial reviewer thinking to catch issues a human might miss. This is your last line of defense before committing.

**Cognitive shift**: Stop thinking like the author who wrote the code. Think like a skeptical reviewer who assumes bugs exist and wants to find them.

---

## Execution Steps

### 1. Collect the Diff

```bash
# Get both staged and unstaged changes
git diff HEAD
```

If the diff is empty, stop: "No uncommitted changes to review."

### 2. Triage Changes

Categorize each changed file by risk level:

| Risk | File Types | Review Depth |
|------|------------|--------------|
| **High** | API routes, auth logic, database queries, state management | Deep scrutiny |
| **Medium** | Business logic, utilities, hooks | Standard review |
| **Low** | Config files, types, tests, docs | Quick scan |

Focus effort where bugs hurt most.

### 3. Surgical Context Pull

For each suspicious pattern in the diff, pull **just enough** context to verify:

- **Changed function signature?** → Check callers
- **Modified state update?** → Check consumers
- **Altered API response?** → Check frontend handlers
- **Changed validation?** → Check what relies on it

**Rule**: Only pull context that the diff *plausibly affects*. This is not a whole-codebase review.

### 4. Functional Critique

Systematically scan for these issue categories:

#### Logic Bugs
- Off-by-one errors
- Wrong comparison operators (`<` vs `<=`, `==` vs `===`)
- Inverted conditions
- Missing `break` in switch statements
- Accidental variable shadowing

#### Edge Cases
- Empty arrays/objects
- Null/undefined inputs
- Boundary values (0, -1, MAX_INT)
- Empty strings vs missing strings
- Race conditions in concurrent access

#### Async/State Pitfalls
- Missing `await`
- Stale closure captures
- State updates that don't trigger re-renders
- Unhandled promise rejections
- Memory leaks (missing cleanup)

#### Broken Assumptions
- Changed return types without updating callers
- Removed fields still referenced elsewhere
- Renamed exports without updating imports
- Changed default values with implicit dependencies

#### Validation & Auth
- Missing input validation on new endpoints
- Auth checks bypassed or weakened
- User input used in SQL/shell/eval
- PII exposure in logs or responses

#### Error Handling
- Swallowed errors (empty catch blocks)
- Missing error boundaries
- Errors that should propagate but don't
- User-unfriendly error messages exposed

#### Test Gaps
- New code paths without test coverage
- Changed behavior with unchanged tests
- Removed tests without removing the code they covered

#### Performance & Maintainability
- N+1 query patterns
- Expensive operations in render loops
- Missing memoization for heavy computations
- Overly complex conditionals that should be simplified

### 5. Generate Report

Output findings in this format:

```markdown
## Commit Review — [timestamp]

### Summary
[X files changed, Y issues found]

---

### Findings

#### Critical
- `src/api/auth.ts:45` — Auth check removed without replacement. Anyone can now access this endpoint.

#### Warning
- `src/hooks/useData.ts:23` — Missing `await` on async call. Will return Promise instead of data.
- `src/components/List.tsx:67` — Filter runs on every render. Should memoize with `useMemo`.

#### Note
- `src/utils/format.ts:12` — New function lacks JSDoc. Consider adding parameter descriptions.

---

### LGTM
[List files that passed review with no issues]
```

If no issues found:
```markdown
## Commit Review — [timestamp]

### LGTM

All changes reviewed. No issues found.

**Files reviewed:**
- src/...
- src/...
```

---

## Rules

1. **Stay scoped to the diff.** Don't critique unchanged code, even if it's bad.
2. **Verify before flagging.** Pull context to confirm suspicions—no drive-by accusations.
3. **Be specific.** Cite file:line and explain *why* it's a problem.
4. **Prioritize correctly.** Security/data-loss issues are Critical. Style preferences are not issues.
5. **No rewrites.** Flag problems, don't rewrite the code. The author will fix it.
6. **Acknowledge clean code.** If something is well-done, say LGTM and move on.

---

## Anti-Patterns

Reject impulses to:

- **Review the whole file** — Only the changed lines matter
- **Suggest refactors** — This is bug-finding, not code review for style
- **Flag theoretical issues** — If you can't construct a realistic failure case, don't flag it
- **Be vague** — "This might cause issues" is useless. Be specific or don't flag.
- **Over-flag** — 20 "Note" items is noise. Focus on what matters.

---

## When NOT to Use

- You want to review a PR from GitHub → use `gh pr diff` + manual review
- You want to check code quality metrics → use `/audit`
- You want to verify a refactoring worked → use `/verify`
- You already committed and want to review → too late, use this *before* committing

---

## Example Session

```
User: /commit-review

Claude: Let me review your uncommitted changes.

[Runs git diff HEAD, categorizes files, pulls context for suspicious patterns]

## Commit Review — 2024-01-15 14:32

### Summary
4 files changed, 2 issues found

---

### Findings

#### Warning
- `src/api/users.ts:89` — New endpoint accepts `userId` from request body but doesn't validate it's a valid UUID. Could cause database error on malformed input.

#### Note
- `src/hooks/useAuth.ts:34` — Added `console.log` with user email. Remove before committing (PII in logs).

---

### LGTM
- `src/types/user.ts` — Type additions look correct
- `src/components/UserCard.tsx` — UI changes are safe
```

---

## Primary Goal

Catch functional problems in your changes before they become committed history—acting as a skeptical reviewer who assumes bugs exist and methodically hunts for them.
