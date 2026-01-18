# /verify [target] — Refactoring Verification
Prove refactoring success with before/after metrics comparison and full CI validation.

---

## 🧠 Purpose
Verify that a refactoring session achieved its goals by comparing metrics, running full CI, and documenting results. This is the final step in the refactoring workflow.

**Target**: `$ARGUMENTS` (same target used in `/refactor`)

---

## 🛠️ Verification Steps

### 1. Full CI Validation
```bash
pnpm ci:verify
```
This runs: typecheck → lint → tests → build → bundle budget.

**If CI fails**: Stop immediately. The refactoring introduced regressions.

### 2. Re-Run Lizard on Target
```bash
./.codacy/cli.sh analyze --tool lizard
```
Extract metrics for the specific target file/function.

### 3. Generate Metrics Comparison

Read before metrics from `tasks/refactor-log.md` and compare:

```markdown
## Verification Report — YYYY-MM-DD

### Target
`$ARGUMENTS`

### Metrics Comparison
| Metric    | Before | After | Delta | Status |
|-----------|--------|-------|-------|--------|
| CCN       | 15     | 9     | -6    | ✅     |
| Lines     | 72     | 45    | -27   | ✅     |
| Params    | 6      | 4     | -2    | ✅     |
| Coverage  | 78%    | 85%   | +7%   | ✅     |

### Overall: PASSED ✅
```

### 4. Behavioral Verification

Run full test suite and E2E smoke tests:
```bash
pnpm test
pnpm e2e:smoke  # if available
```

### 5. Update Refactor Log

Append verification results to `tasks/refactor-log.md`:
```markdown
### Verification — YYYY-MM-DD HH:MM
- CI: PASSED
- Metrics: All improved
- Tests: 142 passed, 0 failed
- E2E: Smoke passed
- Status: COMPLETE ✅
```

### 6. Cleanup

```bash
# Clear the refactoring checkpoint stash
git stash drop "refactor-checkpoint-*"

# Archive the audit file
mkdir -p tasks/_archive
mv tasks/audit-YYYY-MM-DD.md tasks/_archive/
```

---

## 📊 Success Criteria

Verification PASSES when:
- [ ] CI passes completely (`pnpm ci:verify`)
- [ ] At least one metric improved (CCN, lines, or params)
- [ ] No metric got worse
- [ ] Coverage stayed same or improved
- [ ] All tests pass
- [ ] E2E smoke tests pass (if applicable)

Verification FAILS when:
- CI fails
- Any metric got worse without justification
- Coverage dropped
- Tests fail

---

## 🧭 Rules
- **Always run full CI**, not just tests.
- **Compare against baseline metrics** from refactor-log, not intuition.
- **Document everything.** Future you will thank present you.
- **Clean up stashes** to avoid git clutter.
- **Archive completed audits** for historical reference.

---

## ❌ When NOT to Use
- Refactoring hasn't completed yet → finish `/refactor` first
- You want to check metrics only → run Lizard directly
- CI is already failing → fix CI first

---

## 🎯 Primary Goal
Provide proof that the refactoring improved code quality without breaking behavior, with full documentation for future reference.
