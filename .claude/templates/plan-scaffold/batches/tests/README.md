# Tests — Cross-Phase Test Coverage

---

## Purpose

Test batches for critical behaviors. These verify invariants, determinism, error handling, and integration across features.

Test batches are separate from implementation because:
- Tests may span multiple implementation batches
- Some tests can only run after multiple features are complete
- Keeps implementation batches focused

---

## When to Run

Run test batches after their corresponding implementation batches:

| Test Batch | Run After | What It Tests |
|------------|-----------|---------------|
| T-[name] | P[N]-[batch] | [Description] |

---

## Entry Criteria

Before running a test batch:

- [ ] Required implementation batches complete
- [ ] `pnpm typecheck` passes
- [ ] Basic tests passing

---

## Exit Criteria

Test batch complete when:

- [ ] All test cases written
- [ ] All tests passing
- [ ] Coverage thresholds met (if applicable)

---

## Batches

| Batch | File | Description | Prerequisites |
|-------|------|-------------|---------------|
| T-example | `T-example.md` | [What it tests] | P[N]-[X] |

---

## Template for Test Batches

```markdown
# T-[Name]: [What It Tests]

**Run after:** P[N]-[batch], P[N]-[batch]

## Purpose

[What invariants or behaviors this test suite verifies]

## Test Cases

- [ ] **T-1**: [Test case description]
  File: `tests/[path]/[file].test.ts`
  Verify: [What to verify]

- [ ] **T-2**: [Test case description]
  File: `tests/[path]/[file].test.ts`
  Verify: [What to verify]

## Verification

\`\`\`bash
pnpm test tests/[path]/
\`\`\`
```

---

## Test Organization

Tests in this project live in:

```
tests/
├── unit/            # Pure unit tests
├── integration/     # MSW-mocked integration tests
├── e2e/             # Playwright E2E
└── utils/           # Test helpers
```

Feature tests are co-located in `src/features/*/tests/`

---

## Coverage Thresholds

Project enforces:
- Lines: 90%
- Branches: 85%

Check coverage with:
```bash
pnpm test:ci
```
