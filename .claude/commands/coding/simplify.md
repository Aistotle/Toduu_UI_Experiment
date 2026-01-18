# /simplify — Elegant Code Reduction

Look at this code. Get the same results — or better — with less.

## Purpose

Complexity accumulates. Abstractions get added "for flexibility." Edge cases get handled "just in case." Code that started simple becomes clever.

/simplify asks: can this be dumber? Not worse — dumber. Fewer moving parts, fewer concepts, less to hold in your head.

**Output**: Assessment of whether simplification is possible, and if so, a concrete plan. Not code until approved.

## The Simplify Test

/simplify is **subtractive only**. If your proposed change would:
- Add a new file → use /refactor
- Add a new abstraction, type, or pattern → use /refactor
- Restructure how modules relate → use /refactor
- Explore a different approach entirely → use /innovate

If you're not removing something, you're in the wrong command.

## Workflow

### Step 1: Candidacy Assessment

**Before proposing anything, determine if this is a good simplification target.**

**Auto-disqualify if**:
- File is under 80 lines with no nested abstractions
- Every function is ≤15 lines and single-purpose
- You can explain what the code does in one sentence without "and then"
- Simplification would require changes in 3+ other files

If any apply: "This code is already appropriately simple. Nothing to do."

**Otherwise, look for signals**:

| Signal | Indicates |
|--------|-----------|
| Abstraction without variation | Generalized for cases that don't exist |
| Defensive complexity | Handling edge cases that never happen |
| Unnecessary indirection | A calls B calls C, where A could call C |
| State that could be derived | Storing what could be computed |
| Verbose patterns | Idiomatic alternatives exist |
| Copy-paste with variations | Unification opportunity |
| Clever patterns | Code that needs explanation to understand |
| Boolean blindness | Multiple boolean params instead of descriptive options |
| Dead parameters | Arguments that are always the same value |
| Null gymnastics | Complex null handling that better modeling would eliminate |

**Verdict**:

```
## Candidacy: [Good / Marginal / Poor]

**What I found**: [2-3 sentences]

**Simplification potential**: [High / Medium / Low / None]
```

If **Poor** or **None**: Stop here. Say so directly.

### Step 2: "Why Does This Exist?" Check

Before simplifying, ask: is there a reason this complexity exists that I'm not seeing?

Check:
- **Git blame** — was this added to fix a bug?
- **Comments** — is there a "NOTE:" or "HACK:" explaining it?
- **Tests** — do tests specifically exercise this complexity?

If you find evidence the complexity is intentional: "This appears complex, but [reason]. Confirm you want to simplify anyway?"

### Step 3: Cross-File Opportunity Scan

Sometimes the best simplification is unlocked by a change elsewhere.

**Check immediate dependencies only** — files this code imports or is imported by. Cap at 3 files. If it needs more investigation, flag as "potential upstream issue, needs /audit" and move on.

Ask:
1. Is this code fighting against an awkward interface from an import?
2. Is complexity here because a dependency returns data in an inconvenient shape?
3. Would adding one small utility elsewhere eliminate repeated patterns here?

**Cross-file change is only valid if**:
- Upstream change is ≤10 lines
- Upstream change doesn't introduce new concepts (types, abstractions, patterns)
- Net line reduction is at least 3:1 (remove 30+ lines for every 10 added)

If you can't hit these thresholds, the complexity isn't caused upstream — simplify locally or leave it alone.

If found:
```
### Cross-File Opportunity
**Location**: [file]
**Problem**: [what forces complexity here]
**Change**: [small fix, ≤10 lines]
**Net reduction**: [X lines removed for Y lines added]
```

If nothing found: "Complexity is intrinsic to this file. Opportunities are local only."

### Step 4: Simplification Plan

For each opportunity, explain the **conceptual move** using this structure:

> "We can eliminate [specific thing] because [concrete reason — e.g., 'this value is always derivable from X', 'this case never actually occurs', 'these two paths always take the same branch']."

**Bad**: "We can simplify the handler because it's overly complex."
**Good**: "We can eliminate the `userCache` map because `currentUser` is already available from context — we're storing what we could lookup."

```
### Opportunity N: [Name]

**Current state**: [What exists]

**Conceptual move**: "We can eliminate [X] because [Y]"

**What changes**:
- [Concrete change 1]
- [Concrete change 2]

**Risk**: [What could break]

**Effort**: [Trivial < 30min / Moderate 1-2h / Hard 2h+]
```

### Step 5: Recommendation

```
## Recommendation

**Verdict**: [Simplify / Partial simplify / Leave alone]

**Summary**: [What's worth doing and why — or why nothing is]

**Proposed order** (if simplifying):
1. [Lowest risk, highest clarity gain first]
2. [Next change]

Ready to proceed?
```

### Step 6: Implementation

Only after explicit approval.

**Fast path**: If the opportunity is obvious and isolated (e.g., "this ternary chain should be a lookup object"), skip the full ritual — state the move, show the change, do it.

**Standard path**: Implement one opportunity at a time.

**Verification after each change**:
1. If tests exist: run them, all must pass
2. If no tests: manually verify the specific behavior, document what you checked
3. If behavior is ambiguous: stop and ask before proceeding

Never assume "it's obviously the same." Type-check. Run it. Confirm.

After completion, note what was removed (line count, concepts eliminated).

## Rules

1. **Subtractive only** — if you're adding, wrong command
2. **Candidacy first** — don't propose changes for already-simple code
3. **Check why complexity exists** — it might be intentional
4. **Bounded cross-file scan** — immediate dependencies, ≤3 files, ≤10 lines upstream
5. **"Eliminate X because Y"** — every move needs concrete reasoning
6. **Same behavior or better** — never sacrifice correctness for brevity
7. **Verify after each change** — run tests or document manual verification
8. **One change at a time** — simplify incrementally

## Anti-Patterns

- Rewriting instead of reducing — that's /refactor
- "Let me make this more elegant" — elegance is byproduct, not goal
- Moving complexity instead of removing it — net reduction or nothing
- Rationalizing "we add 12 lines but remove 47" without hitting 3:1 threshold
- Premature unification — don't force similar-looking things together
- Removing "unnecessary" handling that was added to fix a bug
- Simplifying tests along with code — tests stay until replaced
- Skipping verification — "obviously the same" is how bugs happen

## When NOT to Use

- Code is already simple (auto-disqualifiers apply)
- You want to restructure, not reduce → /refactor
- You want to explore alternatives → /innovate
- You're fixing a bug → fix it first
- You don't understand what the code does → understand it first
- Changes would cascade to 3+ files → needs /refactor or /audit first