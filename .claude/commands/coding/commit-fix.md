# /commit-fix — Surgical Issue Resolution

Verify commit-review findings and fix them without creating new problems. The bridge between finding issues and safely committing.

---

## Purpose

When `/commit-review` surfaces findings, you need more than blind fixes. This command:
1. Provides a **second opinion** on each finding (are they real issues?)
2. Plans **surgical fixes** that won't create cascades
3. Only executes when **≥90% confident** in safety

**Cognitive shift**: Stop thinking like a helpful fixer who wants to address everything. Think like a skeptical surgeon who treats the codebase as fragile—verify before cutting, measure twice, cut once.

---

## Workflow

### Phase 1: Intake

Ask the user to paste their commit-review findings:

> "Please paste the commit-review findings you want me to verify and fix."

Parse the findings into a structured list:
- Severity (Critical / Warning / Note)
- Location (file:line)
- Description (what the issue allegedly is)

---

### Phase 2: Second Opinion

For **each** finding, independently verify it:

#### Verification Process

1. **Read the actual code** at the cited location (don't trust the description alone)
2. **Pull minimal context** — just enough to understand:
   - What the code is trying to do
   - What callers/consumers expect
   - What the alleged issue would break
3. **Challenge the finding**:
   - Is this actually a bug, or a style preference?
   - Is the "problem" actually intentional behavior?
   - Does the context show the reviewer missed something?
   - Would this actually fail in practice, or is it theoretical?

#### Verification Verdicts

Assign each finding one of:

| Verdict | Meaning | Action |
|---------|---------|--------|
| **Confirmed** | Issue is real and should be fixed | Proceed to planning |
| **Disputed** | Issue is incorrect or overstated | Skip with explanation |
| **Downgraded** | Real but less severe than stated | Fix if low-risk, else skip |
| **Deferred** | Real but too risky to fix now | Skip, note for future |

---

### Phase 3: Triage Report

Present verification results before any fixes:

```markdown
## Second Opinion Report

### Confirmed (will fix)
- `src/api/auth.ts:45` — ✅ Confirmed. Auth check is genuinely missing.

### Disputed (skipping)
- `src/hooks/useData.ts:23` — ❌ Disputed. The `await` is present on line 24; reviewer misread the code.

### Downgraded (skipping)
- `src/utils/format.ts:12` — ⚠️ Real but low-severity. Missing JSDoc is style, not a bug.

### Deferred (too risky)
- `src/state/store.ts:89` — ⏸️ Real issue but fix touches 12 consumers. Needs dedicated refactor session.

---

**Summary**: 3 findings → 1 confirmed, 1 disputed, 1 downgraded, 0 deferred

Proceeding with 1 fix.
```

**⏸️ PAUSE HERE** — Wait for user acknowledgment before proceeding to fixes.

---

### Phase 4: Surgical Planning

For each **Confirmed** issue, create a minimal fix plan:

#### Planning Questions

1. **What's the smallest change that fixes this?**
   - One line? One block? One function?
   - If the fix requires touching multiple files, stop and reconsider

2. **What could this fix break?**
   - List all callers/consumers of the changed code
   - Check for implicit dependencies
   - Consider edge cases the fix might introduce

3. **What's my confidence level?**
   - 90%+ → Proceed
   - 70-89% → Warn user, ask for approval
   - <70% → Skip, explain why

#### Fix Plan Format

```markdown
### Fix Plan: `src/api/auth.ts:45`

**Issue**: Auth check missing on `/users/:id` endpoint

**Proposed fix**: Add `requireAuth()` middleware call before handler

**Change scope**:
- 1 file, 1 line addition
- No signature changes
- No consumer impact

**Risk analysis**:
- Could break: Nothing (additive change)
- Edge cases: None (middleware is well-tested)
- Confidence: 95%

**Proceed**: ✅ Yes
```

---

### Phase 5: Confidence Gate

Before executing ANY fix, run this checklist:

| Check | Requirement |
|-------|-------------|
| Confidence ≥ 90% | Must be very sure |
| Change scope is minimal | Prefer 1-3 lines over 10+ |
| No cascading changes needed | If fix A requires fix B, stop |
| Tests exist for affected code | Or fix is obviously safe |
| No type signature changes | Unless explicitly required |

**If ANY check fails**: Skip the fix and explain why.

---

### Phase 6: Execution

For each approved fix:

1. **Apply the fix** (single, minimal change)
2. **Immediately verify**:
   ```bash
   pnpm typecheck  # Types still work?
   ```
3. **Run targeted tests** (if they exist for that file)
4. **Report result**:
   ```markdown
   ✅ Fixed: `src/api/auth.ts:45`
   - Added `requireAuth()` middleware
   - Typecheck: passed
   - Tests: 3 passed
   ```

**If verification fails**: Immediately revert and report:
```markdown
❌ Fix failed: `src/api/auth.ts:45`
- Typecheck failed: "Type 'void' is not assignable..."
- Reverted change
- Recommendation: Needs manual review
```

---

### Phase 7: Summary

After all fixes (or skips):

```markdown
## Commit-Fix Summary

### Fixed (1)
- `src/api/auth.ts:45` — Added auth check ✅

### Skipped (2)
- `src/hooks/useData.ts:23` — Disputed: not a real issue
- `src/utils/format.ts:12` — Downgraded: style only

### Verification
- Typecheck: ✅ passing
- Lint: ✅ passing

**Ready for**: `/commit-review` (re-run to confirm) or `/commit`
```

---

## Rules

1. **Verify before fixing** — Never trust findings blindly. Read the actual code.
2. **One fix at a time** — Apply, verify, then next. No batch changes.
3. **Minimal changes only** — If a fix requires touching 5+ files, defer it.
4. **Skip when uncertain** — 89% confidence = skip. Better to leave an issue than create three new ones.
5. **Revert on failure** — If verification fails, undo immediately.
6. **Explain all skips** — The user should understand why something wasn't fixed.

---

## Anti-Patterns

Reject impulses to:

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| **Fix everything the review found** | Some findings are wrong or overstated |
| **Batch multiple fixes together** | Can't isolate which fix broke things |
| **"While I'm here, I'll also..."** | Scope creep creates risk |
| **Fix without reading the code** | You might misunderstand the issue |
| **Proceed at 80% confidence** | 80% means 1-in-5 chance of breaking something |
| **Skip verification after fix** | You won't know if you broke something |
| **Fix cascading issues** | If fix A requires fix B, this needs a refactor session, not a quick fix |

---

## Confidence Thresholds

| Confidence | Action |
|------------|--------|
| 95-100% | Fix immediately |
| 90-94% | Fix with brief note |
| 70-89% | Ask user before fixing |
| 50-69% | Skip, explain concerns |
| <50% | Skip, recommend manual review |

---

## When NOT to Use

- **No commit-review findings** → Run `/commit-review` first
- **All findings are style issues** → Just commit, these aren't bugs
- **Fixes require architectural changes** → Use `/refactor` instead
- **You're not sure what the code does** → Read and understand first
- **CI is already failing** → Fix CI before addressing review findings

---

## Example Session

```
User: /commit-fix

Claude: Please paste the commit-review findings you want me to verify and fix.

User:
## Commit Review — 2024-01-15 14:32

### Findings

#### Warning
- `src/api/users.ts:89` — New endpoint accepts `userId` from request body but doesn't validate it's a valid UUID.

#### Note
- `src/hooks/useAuth.ts:34` — Added `console.log` with user email. Remove before committing.

Claude: Let me verify each finding independently.

[Reads src/api/users.ts around line 89]
[Reads src/hooks/useAuth.ts around line 34]

## Second Opinion Report

### Confirmed (will fix)
- `src/api/users.ts:89` — ✅ Confirmed. The endpoint uses `req.body.userId` directly in a database query without UUID validation. Could cause DB error on malformed input.

- `src/hooks/useAuth.ts:34` — ✅ Confirmed. Line 34 has `console.log('User:', user.email)`. PII in logs is a valid concern.

---

**Summary**: 2 findings → 2 confirmed

Ready to proceed with fixes. Continue?

User: yes

Claude:
### Fix 1: `src/api/users.ts:89`

**Proposed fix**: Add UUID validation before database query

**Change**:
```typescript
// Add after line 88
if (!isValidUUID(userId)) {
  return res.status(400).json({ error: 'Invalid user ID format' });
}
```

**Confidence**: 95% — Additive validation, no behavior change for valid inputs.

Applying fix...
✅ Applied
Typecheck: ✅ passing

---

### Fix 2: `src/hooks/useAuth.ts:34`

**Proposed fix**: Remove console.log statement

**Confidence**: 98% — Pure deletion of debug code.

Applying fix...
✅ Applied
Typecheck: ✅ passing

---

## Commit-Fix Summary

### Fixed (2)
- `src/api/users.ts:89` — Added UUID validation ✅
- `src/hooks/useAuth.ts:34` — Removed PII logging ✅

### Verification
- Typecheck: ✅ passing
- Lint: ✅ passing

**Ready for**: `/commit`
```

---

## Primary Goal

Provide a trust layer between finding issues and fixing them—ensuring fixes are correct, minimal, and won't create new problems. When in doubt, skip.
