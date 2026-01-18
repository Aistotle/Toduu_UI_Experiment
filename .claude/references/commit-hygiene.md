# Commit Hygiene

Rules for clean, atomic commits that enable easy debugging and code review.

---

## The Atomic Commit Test

Before committing, ask yourself:

1. Can I describe this commit in one sentence **without using "and"**?
2. If this commit were reverted, would it cleanly undo **one** logical change?
3. Could someone review this commit in isolation and understand it?

If any answer is "no", split the commit.

---

## Pre-Commit Protocol

Before every commit, you MUST:

### 1. Review the Diff
```bash
git diff --staged
```
Check for:
- No `console.log` or debug statements
- No commented-out code
- No TODO/FIXME unless intentional
- No unintended files (`.env`, build artifacts)
- Changes match the intended scope

### 2. Run Tests (Actually Run Them)
```bash
pnpm typecheck && pnpm lint && pnpm test
```
**Forbidden phrases:**
- "The tests should pass" → Run them
- "I'll assume tests pass" → Run them
- "Tests would pass" → Run them

### 3. Stage Selectively
```bash
git add <specific-files>
```
Never `git add .` without reviewing what's included.

### 4. Write the Message
Format: `type(scope): description`

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

Rules:
- 50 chars max for subject line
- Imperative mood: "Add" not "Added" or "Adds"
- Lowercase after type
- No period at end
- Body optional, wrapped at 72 chars

---

## Good vs Bad Commits

### Good (Atomic)
```
feat(resume): add PDF export button
fix(auth): handle expired session redirect
refactor(ai): extract prompt builder to separate module
test(wizard): add coverage for step validation
```

### Bad (Non-Atomic)
```
fix: fixes bugs and adds new feature          # Multiple changes
update code                                    # No type, vague
feat(resume): Add PDF export and fix styling  # "and" = split it
WIP                                           # Never commit WIP
```

---

## Anti-Patterns to Catch

If you're about to do any of these, STOP:

| Anti-Pattern | Do Instead |
|--------------|------------|
| `git add .` | Stage specific files |
| "fixes A, B, and C" | Three separate commits |
| "adds X and refactors Y" | Two separate commits |
| Committing without running tests | Run `pnpm test` first |
| Amending a pushed commit | Create a new fixup commit |
| Force pushing to main | Never |

---

## When to Split

**Split into multiple commits when:**
- Fixing multiple unrelated bugs
- Adding a feature + unrelated refactoring
- Mixing formatting changes with logic changes
- Changing multiple unrelated files

**Keep together when:**
- Function definition + its usage
- Test + implementation it tests
- Config change + feature that needs it

---

## Post-Commit Check

After committing, verify:
```bash
git show --stat
```
- Only intended files included?
- Message follows format?
- No debug statements?

If wrong and NOT pushed: `git commit --amend`
If wrong and pushed: Create fixup commit, don't rewrite history
