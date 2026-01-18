# /commit — Atomic Commit Hygiene

Analyze uncommitted changes, create atomic commits following hygiene rules, and push to remote. Handles changes by intelligently grouping them into logical, atomic, and reviewable commits.

---

> **CRITICAL**: This command has TWO outputs:
> 1. A **commit plan** (Phase 3) — presented to user for review
> 2. **Actual commits** (Phase 4) — executed only after explicit approval
> 3. **ALWAYS PUSH TO MAIN AFTER COMMITTING**
> **NEVER skip Phase 3. NEVER commit without user approval.**

---

## Purpose

When you have uncommitted changes (even 100+ files), this command:
1. Analyzes all changes by type and location
2. Groups them into logical atomic commits
3. **Presents the commit plan for user approval**
4. Commits each group with proper conventional commit messages
5. Pushes all commits to the remote repository

Reference: `.claude/references/commit-hygiene.md`

---

## Workflow

### Phase 1: Analysis

Run these commands to understand the current state:

```bash
# Get all uncommitted changes
git status --short

# See recent commit style for consistency
git log --oneline -10

# Check for staged vs unstaged
git diff --name-only          # unstaged
git diff --name-only --staged # staged
```

Categorize each change:
- `M` = Modified
- `A` = Added (untracked)
- `D` = Deleted
- `R` = Renamed/Moved

### Phase 2: Grouping & Planning

Group changes into atomic commits using this priority order. You will present this plan in Phase 3.

| Priority | Type | Example Files | Commit Type |
|----------|------|---------------|-------------|
| 1 | File moves/renames | `R docs/old → docs/new` | `chore` or `docs` |
| 2 | Feature + tests + snapshots | `src/features/X/**` + `tests/X/**` | `feat` or `fix` |
| 3 | Refactors | Structural changes, hook extractions | `refactor` |
| 4 | Documentation | `*.md`, `docs/**`, READMEs | `docs` |
| 5 | Config/tooling | `*.config.*`, `package.json` | `chore` |
| 6 | Pure deletions | Removed files/directories | `chore` |

**Rename Rule**: Prefer *rename-only* commits when the move is mechanically independent. If the move is required to understand the refactor/feature, keep it in the same commit.

**Atomic Commit Test**: Can you describe the group in one sentence WITHOUT using "and"? If not, split it.

**Snapshot Rule**: Group test snapshots with the feature that caused them to change, not as a separate commit.

### Phase 3: Present Plan (MANDATORY)

**⏸️ STOP HERE AND PRESENT THE PLAN TO THE USER.**

Output a formatted commit plan table showing ALL proposed commits:

```markdown
## 📋 Proposed Commit Plan

| # | Type | Scope | Files | Proposed Message |
|---|------|-------|-------|------------------|
| 1 | docs | - | 12 | archive legacy documentation |
| 2 | feat | resume-studio | 8+3 snapshots | add drag-drop ordering |
| 3 | fix | converters | 3 | handle missing volunteer data |

### Commit Details

**1. docs: archive legacy documentation**
- `docs/old.md` → `docs/_archive/old.md` (R)
- (list all files or summarize with count)

**2. feat(resume-studio): add drag-drop ordering**
- `src/features/resume-studio/ui/SectionList.tsx` (M)
- `src/features/resume-studio/ui/hooks/useDragDrop.ts` (A)
- + 3 snapshot files

[Continue for each commit...]

---

⏸️ **WAITING FOR YOUR APPROVAL**

Reply with:
- **"approve"** — proceed with all commits as planned
- **"adjust 2: change message to..."** — modify a specific commit
- **"merge 1 and 4"** — combine commits
- **"split 2"** — break a commit into smaller pieces
- **"skip 3"** — exclude a commit group
```

**DO NOT proceed to Phase 4 until the user explicitly approves.**

Acceptable approval responses: "approve", "yes", "go ahead", "looks good", "proceed", "lgtm"

If the user provides feedback instead of approval, adjust the plan and present it again.

### Phase 4: Execution (After Approval Only)

**Prerequisite**: User has explicitly approved the commit plan from Phase 3.

For each group, in order:

1. **Stage only those files**
   ```bash
   git add path/to/file1 path/to/file2
   ```

2. **Generate commit message**
   Format: `type(scope): description`
   - Max 50 chars for subject line
   - Imperative mood, lowercase: "add" not "added"
   - No period at end
   - For breaking changes, add `!` after scope: `feat(api)!: remove endpoint`
   - Or include footer: `BREAKING CHANGE: <what breaks + quick migration hint>`

3. **Commit with footer**
   ```bash
   git commit -m "$(cat <<'EOF'
   type(scope): description

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

4. **Verify success**
   ```bash
   git show --stat HEAD
   ```

### Phase 5: Push to Remote

After all commits are successfully created, push to the remote repository:

```bash
git push origin HEAD
```

If the push fails due to diverged history, inform the user and ask how to proceed (pull and rebase, force push, etc.).

---

## Testing Decision

Use AI judgment on when to run tests:

**Run tests when changes touch:**
- `src/lib/**` (core utilities)
- `src/features/**` (feature logic)
- `src/components/**` (shared components)
- `src/app/api/**` (API routes)
- Build config (`next.config.js`, `tsconfig.json`)

**Skip tests when changes are:**
- Pure documentation (`docs/**`, `*.md`)
- File moves/renames only
- Config/chore changes (`tasks/**`, `.claude/**`)

**Snapshots**: If snapshots change, run the test(s) that produced them (or the relevant suite).

**Dependencies/lockfiles**: If `package.json` or lockfiles change, run at least:
```bash
pnpm typecheck && pnpm lint
```

```bash
# When tests are warranted:
pnpm typecheck && pnpm lint && pnpm test
```

---

## Safety Rails

### Never Commit
- `.env`, `.env.*` files
- `credentials.json`, `secrets/**`
- Files matching `*secret*`, `*token*`, `*key*` patterns

### Stop Conditions
- Tests fail on risky changes → fix before continuing
- Untracked file looks sensitive → warn and skip
- Merge conflict markers detected → stop

---

## Commit Message Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests only |
| `docs` | Documentation only |
| `chore` | Tooling, config, dependencies, file moves |

---

## Example Session

### Part 1: Analysis & Plan Presentation (Phases 1-3)

```
$ /commit

Analyzing uncommitted changes...

Running: git status --short
Running: git log --oneline -5
Running: git diff --name-only

Found 47 uncommitted changes across 8 directories.

---

## 📋 Proposed Commit Plan

| # | Type | Scope | Files | Proposed Message |
|---|------|-------|-------|------------------|
| 1 | docs | - | 12 | archive legacy documentation |
| 2 | refactor | resume-studio | 8 | extract editor hooks |
| 3 | feat | resume-studio | 12+24 snapshots | add drag-drop ordering |
| 4 | fix | converters | 3 | handle missing volunteer data |
| 5 | chore | - | 6 | reorganize task files |
| 6 | chore | deps | 2 | update dependencies |

### Commit Details

**1. docs: archive legacy documentation**
- `docs/old-readme.md` → `docs/_archive/old-readme.md` (R)
- `docs/setup-v1.md` → `docs/_archive/setup-v1.md` (R)
- (10 more renames)

**2. refactor(resume-studio): extract editor hooks**
- `src/features/resume-studio/ui/Editor.tsx` (M)
- `src/features/resume-studio/ui/hooks/useEditorState.ts` (A)
- `src/features/resume-studio/ui/hooks/useEditorActions.ts` (A)
- (5 more files)

**3. feat(resume-studio): add drag-drop ordering**
- `src/features/resume-studio/ui/components/SectionList.tsx` (M)
- `src/features/resume-studio/ui/hooks/useDragDrop.ts` (A)
- `tests/unit/resume-studio/drag-drop.test.tsx` (A)
- + 24 snapshot files

**4. fix(converters): handle missing volunteer data**
- `src/lib/converters/json-resume.ts` (M)
- `tests/unit/converters/json-resume.test.ts` (M)
- `tests/fixtures/resume-no-volunteer.json` (A)

**5. chore: reorganize task files**
- `tasks/old-todo.md` → `tasks/_archive/old-todo.md` (R)
- (5 more moves)

**6. chore(deps): update dependencies**
- `package.json` (M)
- `pnpm-lock.yaml` (M)

---

⏸️ **WAITING FOR YOUR APPROVAL**

Reply with:
- **"approve"** — proceed with all 6 commits as planned
- **"adjust 2: change message to..."** — modify a specific commit
- **"merge 5 and 6"** — combine commits
- **"split 3"** — break a commit into smaller pieces
- **"skip 1"** — exclude a commit group
```

### Part 2: Execution (Phase 4 — after user approves)

```
> approve

Executing 6 atomic commits...

[1/6] docs: archive legacy documentation
      12 files changed
      ✓ Committed (a1b2c3d)

[2/6] refactor(resume-studio): extract editor hooks
      8 files changed
      Running tests... ✓ passed
      ✓ Committed (e4f5g6h)

[3/6] feat(resume-studio): add drag-drop ordering
      36 files changed (includes snapshots)
      Running tests... ✓ passed
      ✓ Committed (i7j8k9l)

[4/6] fix(converters): handle missing volunteer data
      3 files changed
      Running tests... ✓ passed
      ✓ Committed (m0n1o2p)

[5/6] chore: reorganize task files
      6 files changed
      ✓ Committed (q3r4s5t)

[6/6] chore(deps): update dependencies
      2 files changed
      Running tests... ✓ passed
      ✓ Committed (u6v7w8x)

Pushing to remote...
      ✓ Pushed 6 commits to origin/main

Done. Created 6 atomic commits and pushed to remote.
```

---

## Rules

1. **One logical change per commit** — never batch unrelated changes
2. **No "and" in commit messages** — if you need "and", split the commit
3. **Group tests with implementation** — don't separate test commits from the code they test
4. **Group snapshots with features** — snapshot updates belong with the change that caused them
5. **Run tests on risky changes** — use judgment, err on the side of running them
6. **Never commit secrets** — auto-skip sensitive files

---

## ❌ Anti-Patterns

These behaviors defeat the purpose of this command. **DO NOT:**

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| Committing without showing the plan | User can't review or adjust groupings |
| Asking "Can I commit?" without showing WHAT | User needs to see the actual plan |
| Proceeding after vague "ok" without showing plan | Always show the formatted plan first |
| Lumping all changes into one commit | Defeats the purpose of atomic commits |
| Skipping Phase 3 entirely | The approval gate is mandatory |
| Making commits before user says "approve" | Explicit approval is required |

---

## When NOT to Use

- Single file change → just commit it normally
- Need to commit specific files only → use `git add` + `git commit` directly
- WIP/temporary checkpoint → don't commit WIP, use `git stash` instead
- Merge conflicts present → resolve conflicts first

---

## Related Commands

- `/hygiene` — Find organizational debt before committing
- `/audit` — Check code quality metrics
- `/handoff` — Create session summary after committing
