# /hygiene — Codebase Hygiene Analysis

Find organizational debt: dead code, misplaced files, stale documentation, and cleanup opportunities. Outputs a trackable plan to `tasks/hygiene-YYYY-MM-DD.md`.

---

## 🧠 Purpose

While `/audit` measures code quality (complexity, coverage), `/hygiene` measures codebase organization. It finds the cruft that accumulates over time: orphaned files, unused exports, stale TODOs, and things in the wrong place.

**Output**: A plan file with ticketed items that can be worked through systematically.

---

## 🛠️ Analysis Categories

### 1. Dead Code Detection
```bash
# Use our conservative knip config (RECOMMENDED)
pnpm knip

# For stricter analysis (more false positives)
pnpm knip:strict
```

**IMPORTANT**: Always verify knip results before flagging:
```bash
# Verify a dependency is truly unused
grep -r "from ['\"]package-name['\"]" src/ --include="*.ts" --include="*.tsx"

# Verify a file is truly unused
grep -r "from ['\"]./path/to/file['\"]" src/ --include="*.ts" --include="*.tsx"
```

If knip isn't available, use manual detection but BE CONSERVATIVE.

### 2. File Organization

Scan for:
- **Misplaced files**: Components in `lib/`, utilities in `features/`, etc.
- **Inconsistent naming**: Mix of `camelCase.ts` and `kebab-case.ts` in same directory
- **Empty directories**: Directories with no files or only `.gitkeep`
- **Orphaned test files**: Test files whose source file was deleted/moved
- **Barrel export issues**: `index.ts` files that re-export deleted modules

Expected structure for this project:
```
src/
├── app/           # Next.js pages and routes only
├── components/    # Shared UI components
├── features/      # Feature modules (co-located logic + UI)
├── lib/           # Shared utilities, API clients, helpers
└── types/         # Shared type definitions
```

### 3. Documentation Debt
```bash
# Find all TODOs
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx"
```

Also check:
- Comments referencing deleted functions/variables
- README files that don't match current structure
- JSDoc comments with wrong parameter names

### 4. Dependency Hygiene
```bash
# Unused dependencies (uses conservative config)
pnpm knip

# Outdated dependencies (informational only)
pnpm outdated

# Circular imports (if using madge)
npx madge --circular src/
```

**CRITICAL**: Most "unused dependency" reports are FALSE POSITIVES. Always verify with grep before flagging.

### 5. Test Hygiene
```bash
# Find skipped tests
grep -rn "\.skip\|it\.skip\|describe\.skip\|test\.skip" src/ --include="*.test.*" --include="*.spec.*"
```

Also check:
- Test files without matching source files
- Tests without assertions

### 6. Type Safety
```bash
# Count `any` usage
grep -rn ": any\|as any\|<any>" src/ --include="*.ts" --include="*.tsx" | wc -l

# Find @ts-ignore and @ts-expect-error
grep -rn "@ts-ignore\|@ts-expect-error" src/ --include="*.ts" --include="*.tsx"
```

---

## 📋 Output Format

Generate `tasks/hygiene-YYYY-MM-DD.md`:

```markdown
# Hygiene Plan — YYYY-MM-DD

## Summary

| Category | Issues | Estimated Effort |
|----------|--------|------------------|
| Dead Code | X | Xh |
| File Organization | X | Xh |
| Documentation Debt | X | Xh |
| Dependency Hygiene | X | Xh |
| Test Hygiene | X | Xh |
| Type Safety | X | Xh |
| **Total** | **X** | **Xh** |

---

## Tickets

### 🗑️ Dead Code

- [ ] `HYG-001` [type] Description — `path/to/file.ts:line`

### 📁 File Organization

- [ ] `HYG-010` [move] Move `src/components/X.tsx` → `src/features/Y/ui/`
- [ ] `HYG-011` [delete] Remove empty directory `src/features/deprecated/`

### 📝 Documentation Debt

- [ ] `HYG-020` [todo] Resolve TODO in `file.ts:45`: "original text"

### 📦 Dependency Hygiene

- [ ] `HYG-030` [unused] Remove unused dependency `package-name`

### 🧪 Test Hygiene

- [ ] `HYG-040` [skipped] Unskip or delete `file.test.ts:23`

### 🔷 Type Safety

- [ ] `HYG-050` [any] Replace `any` in `file.ts:34` with proper type

---

## Priority Order

1. Dead code (reduces noise)
2. File organization (makes codebase navigable)
3. Test hygiene (ensures safety net works)
4. Type safety (catches bugs early)
5. Documentation debt (improves maintainability)
6. Dependency hygiene (security + bundle size)

---

## Working Through This Plan

Tell Claude Code:
> "Work through the hygiene plan starting with HYG-001"

Or for bulk:
> "Fix all dead code tickets (HYG-001 through HYG-009)"
```

---

## ⚠️ Verification Requirements (MANDATORY)

**Before flagging ANY dependency as unused:**
1. Run: `grep -r "from ['\"]package-name['\"]" src/ --include="*.ts" --include="*.tsx"`
2. Check `src/components/ui/` for shadcn wrappers that use it
3. Check if it's used via dynamic import (`import()`)
4. If grep finds 0 results AND it's not in the ignore list below, flag it

**Before flagging ANY file as unused:**
1. Is it in `src/components/ui/`? → **KEEP** (shadcn wrapper)
2. Is it in `scripts/`? → **KEEP** (standalone CLI tool)
3. Does it re-export from node_modules? → **KEEP** (wrapper)
4. Is it a barrel `index.ts`? → Check what it re-exports first

---

## 🚫 Known False-Positive Patterns (Auto-Skip)

These are ALWAYS incorrectly flagged by knip. Do NOT include them in hygiene reports:

| Pattern | Reason |
|---------|--------|
| `src/components/ui/*.tsx` | Shadcn wrappers for Radix |
| `scripts/ops/*.ts` | Standalone admin scripts |
| `scripts/dev/*.ts` | Development utilities |
| `@radix-ui/*` | Used via shadcn wrappers |
| `@tiptap/*` | Dynamic extension loading |
| `@supabase/*` | Used via lib/supabase wrappers |
| `clsx`, `tailwind-merge`, `class-variance-authority` | Used by cn() in utils.ts |
| `cmdk`, `vaul` | Used by shadcn command/drawer |
| `gsap`, `@gsap/react` | Used by motion components |
| `typst` | Used by resume studio template system |
| `dexie`, `dexie-react-hooks` | Used by resume offline store |
| `unified`, `remark-*`, `mdast-*`, `unist-*` | Used by markdown import |
| `date-fns` | Used by dashboard components |
| `phosphor-react` | Used by discussions |
| `html2canvas`, `isomorphic-dompurify` | Used by cv-builder |
| `react-dropzone` | Used by resume wizard |

---

## 🧭 Rules

- **Don't fix during analysis.** Hygiene produces the plan; execution is separate.
- **Use the knip config.** Run `pnpm knip` which uses our conservative `knip.config.ts`.
- **VERIFY before flagging.** Always grep to confirm something is truly unused.
- **Be conservative.** When in doubt, DON'T flag it.
- **Ticket IDs are sequential.** HYG-001, HYG-002, etc.

---

## ❌ When NOT to Use

- Measure code complexity → use `/audit`
- Refactor a specific file → use `/refactor`
- Security issues → use `security-auditor` agent

---

## 🎯 Primary Goal

Produce a prioritized, trackable plan for cleaning up organizational debt.
