# Refactoring Decision Tree

When metrics exceed thresholds, use this guide to select the right transformation.

---

## Metric → Pattern Mapping

### Cognitive Complexity > 15
| Symptom | Pattern |
|---------|---------|
| Mixed UI + logic | Extract custom hook |
| Complex conditions | Extract helper functions |
| Deep nesting | Early returns, guard clauses |

### Cyclomatic Complexity > 10
| Symptom | Pattern |
|---------|---------|
| Many if/else branches | Early returns |
| Large switch | Object mapping or extract functions |
| Multiple &&/|| chains | Extract conditions to variables |

### Expression Complexity > 5
| Symptom | Pattern |
|---------|---------|
| Long boolean expressions | Extract to named variables |
| Nested ternaries | Extract to function or if/else |

### Function Lines > 50
| Symptom | Pattern |
|---------|---------|
| Large React component | Extract smaller components |
| Complex business logic | Extract custom hooks |
| Mixed concerns | Separate UI from logic |

### Nesting Depth > 4
| Symptom | Pattern |
|---------|---------|
| Callback hell | async/await |
| Nested conditionals | Guard clauses |

### Parameters > 5
| Symptom | Pattern |
|---------|---------|
| Long parameter lists | Parameter object / options object |
| Related params | Group into typed interface |

---

## Code Smell Categories (for `/audit`)

1. **Bloaters** — Long Method, Large Class, Long Parameter List, Primitive Obsession
2. **OO Abusers** — Switch Statements, Temporary Field, Refused Bequest
3. **Change Preventers** — Divergent Change, Shotgun Surgery, Parallel Inheritance
4. **Dispensables** — Dead Code, Lazy Class, Speculative Generality, Excessive Comments
5. **Couplers** — Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man

---

## React/Next.js Specific

| Linter Rule | Pattern |
|-------------|---------|
| react/no-unstable-nested-components | Extract component to file scope |
| react-hooks/exhaustive-deps | Simplify deps, useMemo for objects |
| useEffect for data | Server component or server action |
| Unnecessary 'use client' | Remove directive, use server components |
| Sequential awaits | Promise.all for parallel execution |

---

## Metric Thresholds Reference

| Tool | Metric | Our Threshold | SonarJS Default | Notes |
|------|--------|---------------|-----------------|-------|
| Lizard | CCN | 10 | 10 | Cyclomatic complexity |
| Lizard | Lines | 50 | 200 | We're stricter |
| Lizard | Params | 5 | N/A | Lizard-specific |
| SonarJS | Cognitive | N/A | 15 | Add to ESLint if not present |
| SonarJS | Expression | N/A | 5 | Nested ternaries |
| SonarJS | Nesting | N/A | 4 | Control flow depth |
| SonarJS | File lines | N/A | 600 | Consider splitting |

### When to Override
Thresholds can be ignored with documented justification when:
- Performance-critical hot paths require inlining
- Generated code (migrations, schemas)
- Test files with many assertions
- Compatibility shims that must match external API shape

---

## Quick Reference: Transformation Priority

When multiple issues exist, address in this order:
1. **Extract pure functions** — Easiest wins, no side effects
2. **Flatten conditionals** — Guard clauses, early returns
3. **Reduce parameters** — Object params, builder pattern
4. **Remove duplication** — Only after seeing 3+ occurrences
5. **Rename for clarity** — Last, after structure is stable
