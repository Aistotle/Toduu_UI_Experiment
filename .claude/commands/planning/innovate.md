# /innovate — Divergent Solution Exploration

Step back from the current approach. Explore alternatives. Find the better path before committing.

## Purpose

AI defaults to the first reasonable solution. That's often fine. But sometimes you're stuck in a local optimum, building on a shaky foundation, or missing a 10x simpler approach.

/innovate forces the solution space open before you commit.

**Output**: Senior-dev consulting advice — not code. If approved, either implement directly or create a plan file for major changes.

## Scope

Works best at:
- Single file (function, component, hook)
- Individual feature (a coherent unit of functionality)

For system-level architecture, break into sub-problems first.

## Workflow

### 1. Anchor

Before diverging, establish the anchor:

- **What are we solving?** (The "what", not the "how")
- **Current approach** (if any) — one paragraph max
- **Why question it?** (Gut feel? Friction? Complexity? Curiosity?)

### 2. Assumption Excavation

Surface what's being taken for granted:

- What constraints are *real* vs. *inherited*?
- What would a newcomer question about this approach?
- What are we assuming about the data, the user, the system?
- Is this solving the *actual* problem or a *perceived* problem?

List 3-5 assumptions explicitly. Mark each: **hard constraint** (can't change) or **soft assumption** (could challenge).

### 3. Unlock Scan

Look beyond the immediate scope for leverage points.

**Required steps:**

1. List the 3-5 files/modules that most directly interact with this scope
2. For each: what assumption does this code make about that neighbor?
3. Which assumptions create friction here?
4. Would changing any neighbor (type, utility, hook) make this trivial?

Look for:
- **Complexity sources**: Is the awkwardness here *caused* by something elsewhere?
- **Missing abstractions**: Would a small new utility/hook/type make this trivial?
- **Wrong abstractions**: Is existing shared code forcing awkward patterns?
- **Leaky types**: Is a type too loose, forcing defensive handling downstream?

If found:
```
### Unlock Opportunity
**Location**: [specific file/module]
**Current state**: [what it does now]
**Small change**: [what could change]
**Unlocks**: [what simplification this enables in target scope]
```

If nothing found: "No unlock opportunities identified — complexity appears intrinsic to this scope."

### 4. Divergent Generation

Generate 3-5 genuinely different approaches using structured lenses:

| Lens | Question |
|------|----------|
| Inversion | What if we did the opposite? |
| Subtraction | What if we removed the hardest part entirely? |
| Decomposition | What if this were 3 separate things instead of 1? |
| Deletion test | If we removed this entirely, what would actually break? |
| Analogy | How do games / spreadsheets / file systems solve this? |
| Constraint flip | What if [constraint] didn't exist? What if it were 10x stricter? |
| Naive | What would someone build who'd never seen the current approach? |

**Divergence requirement**: At least one approach must reject the current mental model entirely. Not a variation — a different paradigm. If two approaches have the same core data flow, they're not different enough. Dig deeper.

For each approach:
```
### Approach N: [Name]
**Core idea**: [One sentence]
**How it works**: [Brief description]
**Gains**: [What you get]
**Loses**: [What you give up]
**Biggest risk**: [What could go wrong]
**Feasibility**: [See scale below]
```

**Feasibility scale:**
- **Trivial**: < 30 minutes, no risk
- **Moderate**: 1-4 hours, low risk
- **Hard**: 4+ hours or touches multiple files with risk
- **Research**: Unknown duration, needs investigation before committing

### 5. Evaluation

Compare approaches honestly:

- Which best fits the actual constraints (not inherited assumptions)?
- Which has the simplest failure modes?
- Which would you be happiest maintaining in 6 months?
- Does any approach make the problem *dissolve* rather than just *solve*?

### 6. Recommendation

Conclude with ONE of:

**A. Pursue an alternative**
```
## Recommendation: Pursue [Approach Name]

**Why**: [Core reasoning]
**Key risk to watch**: [What to validate early]
**Feasibility**: [Trivial / Moderate / Hard]

Ready to proceed?
```

**B. Current approach is sound**
```
## Recommendation: Stay the course

The current approach is well-suited to the constraints. Alternatives trade [X] for [Y], which isn't worth it because [reason].

[Optional: minor refinements worth considering]
```

**C. Needs more exploration**
```
## Recommendation: Dig deeper

This needs more exploration before committing. Key questions to answer:
1. [Question]
2. [Question]

Suggested next step: [Specific action]
```

### 7. Implementation

Only after explicit approval.

**If Trivial/Moderate**: Implement directly.

**If Hard**: Create a plan file at `tasks/innovate-[slug]-YYYY-MM-DD.md` with:
- Phased implementation steps
- Risk checkpoints
- Rollback strategy

## Rules

1. **Consult first, code later** — output is advice until approved
2. **Diverge genuinely** — at least one approach must be a different paradigm
3. **Make Unlock Scan operational** — name specific files, examine real interactions
4. **Honor hard constraints** — challenge assumptions, not reality
5. **"Stay the course" is valid** — don't manufacture change for its own sake
6. **Scope your recommendation** — feasibility determines next step

## Anti-Patterns

- Generating 5 variations of the same idea — fake divergence
- "Let's try a completely new architecture" — too big, break it down first
- Ignoring feasibility — beautiful ideas that take 3 months aren't helpful
- Changing everything — find the minimal intervention with maximum leverage
- Falling in love with cleverness — simple and boring often wins
- New is not inherently better — the burden of proof is on the alternative to justify migration cost

## When NOT to Use

- You know what to build and just need to build it
- It's a bug fix (use debugging, not innovation)
- You want to clean up existing code (use /simplify or /refactor)
- You're exploring system architecture (too broad — scope down first)
- You should run /audit first to understand what's actually wrong before innovating solutions