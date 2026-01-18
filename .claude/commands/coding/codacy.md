# /codacy — Scoped Static Analysis

Run scoped Codacy scans, summarize SARIF output, and guide fix iterations.

---

## Purpose

Quick, targeted static analysis with human-readable output. Instead of running full-repo scans and parsing raw SARIF, this command scopes the analysis and summarizes findings.

**Cognitive shift**: Scope first, summarize always, iterate on failures.

---

## Workflow

### 1. Scope Identification

Before running any scan, determine the scope:

| Scope Type | When to Use |
|------------|-------------|
| **Single file** | Fixing a specific file, pre-commit check |
| **Directory** | Feature work, module-level analysis |
| **Tool subset** | Only need eslint, or only security (semgrep+trivy) |
| **Full repo** | Only when explicitly requested AND excludes are configured |

**Default to narrow scope.** Full-repo scans are slow and noisy.

### 2. Execute Scan

Use the wrapper script for consistent SARIF output:

```bash
# Single file
./.codex/skills/codacy-mcp-ops/scripts/codacy_scan.sh --tool eslint --path src/app/page.tsx

# Directory with specific tool
./.codex/skills/codacy-mcp-ops/scripts/codacy_scan.sh --tool semgrep --path src/lib/api/

# Multiple tools with timeouts (recommended for broader scans)
python3 ./.codex/skills/codacy-mcp-ops/scripts/codacy_scoped_suite.py --tools eslint,semgrep --scope src/features/

# Security sweep
python3 ./.codex/skills/codacy-mcp-ops/scripts/codacy_scoped_suite.py --tools semgrep,trivy
```

SARIF output lands in `.codacy/logs/`.

### 3. Summarize Findings

**Always summarize SARIF output.** Never leave raw JSON as the final answer.

```bash
node ./.codex/skills/codacy-mcp-ops/scripts/sarif_summary.mjs .codacy/logs/codacy-eslint.sarif
```

Report format:
- Total issues by severity (error/warning/note)
- Top 5 files with most issues
- Top 5 rules triggered
- Actionable next steps

### 4. Fix Loop

For narrow scopes only:

```bash
# Apply auto-fixes (ONLY on narrow scope)
./.codacy/cli.sh --config .codacy/codacy.yaml analyze --tool eslint --fix path/to/file.ts

# Re-run to verify
./.codex/skills/codacy-mcp-ops/scripts/codacy_scan.sh --tool eslint --path path/to/file.ts
```

**Never use `--fix` on broad scopes** — review diffs before committing.

---

## Available Tools

| Tool | Purpose | Typical Scope |
|------|---------|---------------|
| `eslint` | JavaScript/TypeScript linting | `src/`, `scripts/`, `tests/` |
| `semgrep` | Security patterns, code smells | `src/`, `scripts/`, `supabase/` |
| `trivy` | Vulnerability scanning | `.` (repo root) |
| `lizard` | Cyclomatic complexity | `src/`, `scripts/` |
| `pmd` | Java/general static analysis | `src/`, `scripts/` |
| `pylint` | Python linting | `scripts/` |

---

## Quick Reference

```bash
# Lint a file
./.codex/skills/codacy-mcp-ops/scripts/codacy_scan.sh --tool eslint --path src/app/page.tsx

# Security scan on a folder
./.codex/skills/codacy-mcp-ops/scripts/codacy_scan.sh --tool semgrep --path src/lib/

# Full suite on src/ with timeouts
python3 ./.codex/skills/codacy-mcp-ops/scripts/codacy_scoped_suite.py --scope src

# Summarize any SARIF file
node ./.codex/skills/codacy-mcp-ops/scripts/sarif_summary.mjs .codacy/logs/codacy-eslint.sarif
```

---

## Anti-Patterns

Reject impulses to:
- **Run full-repo scans** when a file or folder would suffice
- **Skip summarization** — raw SARIF is not actionable output
- **Use `--fix` on broad scopes** — always review diffs first
- **Ignore timeouts** — use the scoped suite script for multi-tool runs
- **Forget to re-verify** — after fixes, re-run the same scoped scan

---

## When NOT to Use

| Need | Use Instead |
|------|-------------|
| Broad codebase health metrics | `/audit` |
| Dead code, misplaced files | `/hygiene` |
| Deep security vulnerability analysis | `security-auditor` agent |
| Database schema/migrations | `supabase-specialist` agent |
| One-off CLI command | Just run it directly |

---

## Configuration

- **Config file**: `.codacy/codacy.yaml`
- **Tool configs**: `.codacy/tools-configs/`
- **SARIF output**: `.codacy/logs/` (gitignored)
- **Scripts**: `.codex/skills/codacy-mcp-ops/scripts/`

See `.codex/skills/codacy-mcp-ops/references/codacy.md` for detailed CLI flags and repo-specific defaults.
