# /refactor [target] — Safe Incremental Refactoring
Execute validated refactoring with automatic rollback on failure. One transformation at a time, test after each.

---

## 🧠 Purpose
Apply safe, incremental refactoring to a target identified by `/audit`. Each transformation is validated before committing. Failures trigger automatic rollback.

**Target**: `$ARGUMENTS` (file path or function reference from audit)

---

## 🛠️ Pre-Flight Checklist

Before ANY refactoring, verify ALL conditions:

### 1. Target in Recent Audit
```bash
grep -l "$ARGUMENTS" tasks/audit-*.md
```
If not found: **STOP**. Run `/audit` first.

### 2. Test Coverage Check
Target must have ≥80% coverage. If not:
- Delegate to `test-generator` agent to add tests first
- Re-run coverage, then continue

### 3. Baseline Tests Green
```bash
pnpm typecheck && pnpm lint && pnpm test
```
If failing: **STOP**. Fix tests first.

### 4. Git Checkpoint
```bash
git stash push -m "refactor-checkpoint-$(date +%s)"
```
Record stash reference in `tasks/refactor-log.md`.

---

## 🔄 Transformation Priority

Apply transformations **one at a time**, in this order:

1. **Extract pure functions** — Move logic with no side effects to standalone functions
2. **Flatten conditionals** — Convert nested if/else to early returns (guard clauses)
3. **Reduce parameters** — Use object parameters or builder pattern for >3 args
4. **Remove duplication** — Extract shared logic after seeing 3+ occurrences
5. **Rename for clarity** — Improve names only after structure is stable

---

## ✅ Validation Loop

For EACH transformation:

```
1. Apply the change
2. Run validation:
   pnpm typecheck && pnpm lint && pnpm test
3. If PASS:
   - git add -A && git commit -m "refactor: [description]"
   - Log to tasks/refactor-log.md
   - Record before/after metrics
4. If FAIL:
   - git checkout -- .
   - Retry with different approach (max 2 retries)
   - If still failing: invoke /anti-loop
```

---

## 🚨 Escape Conditions

- **Max 2 retries** per transformation → invoke `/anti-loop`
- **Max 5 transformations** per session → stop and run `/verify`
- **Coverage drops below 80%** → stop immediately
- **Unrelated tests fail** → stop, investigate scope creep

---

## 📝 Logging

Append each session to `tasks/refactor-log.md` using this template:

```markdown
## Refactor: [Target] — YYYY-MM-DD

### Rationale
[Why this target? What problem does it solve?]

### Before Metrics
| Metric | Value |
|--------|-------|
| CCN | 15 |
| Lines | 72 |
| Params | 6 |
| Coverage | 78% |

### Transformations Applied
1. ✅ Extract pure function `buildAgentConfig` — CCN 15→12
2. ✅ Flatten conditionals — CCN 12→9
3. ⏹️ Stopped (reached 5 transformations)

### After Metrics
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| CCN | 15 | 9 | -6 ✅ |
| Lines | 72 | 45 | -27 ✅ |
| Params | 6 | 4 | -2 ✅ |
| Coverage | 78% | 85% | +7% ✅ |

### Breaking Changes
None (internal refactoring)

### Performance Impact
Not measured / No regression / 15% improvement

### Stash Reference
refactor-checkpoint-1703345678

### Lessons Learned
[Optional: What would you do differently?]
```

---

## 🧭 Rules
- **One transformation at a time.** Never batch changes.
- **Always validate after each change.** No exceptions.
- **Never skip the pre-flight checklist.**
- **Commit after each successful transformation.** Enables bisection.
- **Stop at 5 transformations.** Run `/verify` to consolidate.

---

## ❌ When NOT to Use
- Target isn't in recent audit → run `/audit` first
- Coverage <80% and haven't run test-generator → add tests first
- Architectural changes spanning >5 files → use bulk refactoring plugin
- No clear metric improvement goal → just leave it alone

---

## 🎯 Primary Goal
Improve code quality metrics (CCN, lines, params) while maintaining behavioral equivalence, with full traceability and automatic rollback on failure.
