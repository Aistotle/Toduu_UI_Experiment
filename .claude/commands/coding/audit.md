# /audit — Codebase Health Analysis
Find refactoring targets using metrics, not intuition. Outputs prioritized list to `tasks/audit-[date].md`.

---

## 🧠 Purpose
Analyze codebase health by combining **complexity metrics**, **git churn**, and **test coverage** to identify high-impact refactoring targets. This command produces evidence-based priorities, not guesses.

---

## 🛠️ Execution Steps

### 1. Run Complexity Analysis
```bash
./.codacy/cli.sh analyze --tool lizard
```
Flag functions exceeding thresholds:
- **CCN > 10** (cyclomatic complexity)
- **Lines > 50** (function length)
- **Parameters > 5** (argument count)

### 2. Correlate with Git Churn (30 days)
```bash
git log --since="30 days ago" --format= --name-only | sort | uniq -c | sort -rn | head -30
```
High churn + high complexity = highest priority.

### 3. Cross-Reference Test Coverage
Parse `coverage/coverage-summary.json` (run `pnpm test:ci` if stale).
Flag: **High complexity + Low coverage (<80%) = CRITICAL**.

### 4. Scan for Stack-Specific Smells
Check for Next.js/React anti-patterns:
- Unnecessary `'use client'` directives (should be server by default)
- `useEffect` for data fetching (should use server components/actions)
- Missing `React.memo` on list item components
- Sequential `await` statements (should be `Promise.all`)

### 5. Generate Priority Table
Output to `tasks/audit-YYYY-MM-DD.md`:

```markdown
# Codebase Audit — YYYY-MM-DD

| Priority | Target | Issue | Metric | Interest | Action |
|----------|--------|-------|--------|----------|--------|
| CRITICAL | src/lib/ai/router.ts:45 | High CCN + low coverage | CCN=15, Cov=62% | ~2h/sprint | Add tests, then refactor |
| HIGH | src/features/resume-wizard/... | High churn + complexity | CCN=12, Churn=23 | ~1h/sprint | Extract functions |
| MEDIUM | ... | ... | ... | ~0.5h/sprint | ... |

## Stack Smells
- [ ] `src/app/foo/page.tsx`: unnecessary 'use client'
- [ ] ...

## Churn Hotspots (top 10)
1. filename (N changes)
...
```

### Interest Calculation
"Interest" estimates ongoing maintenance cost if the debt isn't addressed:
- **High churn (>10 changes/month) + High CCN (>12)**: ~2-4h/sprint
- **High churn + Medium CCN (8-12)**: ~1-2h/sprint
- **Low churn + High CCN**: ~0.5h/sprint (can wait)
- **Dead code / no churn**: 0h (archive instead of refactor)

Interest helps prioritize: a CCN=12 file touched daily costs more than CCN=15 touched once a year.

---

## 🧭 Rules
- **Never audit and fix in the same session.** Audit produces the list; `/refactor` executes.
- **Do not skip the churn analysis.** Frequently changed files matter more.
- **Do not ignore low-coverage files.** They are higher risk.
- **Output must be machine-parseable.** Other commands read this file.

---

## ❌ When NOT to Use
- You just fixed something and want to verify → use `/verify`
- You already know the specific target → skip to `/refactor`
- Quick typo fixes or single-line changes → just do them

---

## 🎯 Primary Goal
Produce a prioritized, evidence-based list of refactoring targets that can be systematically addressed with `/refactor`.
