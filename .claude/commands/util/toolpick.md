# /toolpick — Tool Selection Advisor

Analyze your task and recommend the optimal commands, skills, agents, or MCP servers.

---

## 🧠 Purpose
Before starting work, identify which of your available tools would meaningfully
improve the process or result. This command inventories your toolkit and matches
it to your task intent—including recommending sequences when multiple tools
work together.

---

## 🛠️ Execution Steps

### 1. Inventory Available Tools
Read `.claude/installed.md` for the complete, auto-synced inventory of:
- Plugins (global)
- MCP Servers (project)
- Skills (project)
- Agents (project)

**Always available (built-in Claude Code agents):**
- `Explore` — Fast codebase search and pattern discovery
- `Plan` — Implementation planning and architecture design
- `claude-code-guide` — Claude Code documentation lookup

**Fallback:** If `installed.md` seems incomplete, check `~/.claude/settings.json` for enabled plugins.

### 2. Parse Task Intent
Extract key signals from the user's task description:
- **Action verbs**: refactor, audit, test, debug, deploy, document, etc.
- **Domain keywords**: database, frontend, security, API, etc.
- **Scope indicators**: single file, whole codebase, specific feature

### 3. Match Tools to Intent

| Intent Signals | Recommended Tools | Why |
|----------------|-------------------|-----|
| refactor, clean, improve | `/audit` → `/refactor` → `/verify` | Evidence-based refactoring loop |
| debug, fix, broken, stuck | `/map-it-out`, `/anti-loop` | Fresh-eyes reasoning |
| test, coverage | `test-generator` agent | Specialized test expertise |
| security, vulnerability, audit | `security-auditor` agent | OWASP/auth expertise |
| database, migration, RLS, schema | `supabase-specialist` agent + Supabase MCP | DB expertise + direct access |
| docs, documentation, library | Context7 MCP | Fetch current library docs |
| frontend, UI, React, styling | `gemini-frontend` skill | Delegated frontend expertise |
| commit, git | `/commit` | Atomic commit workflow |
| handoff, continue, session | `/handoff`, `/pickup` | Session continuity |
| simplify, reduce, delete | `/simplify` | Subtractive changes |
| dead code, unused, hygiene | `/hygiene` | Organizational debt |
| find, where, explore | `explore-codebase` agent | Fast codebase navigation |

### 4. Output Recommendation

**Format when tools match:**
```
**Recommended Approach:**

**Primary**: [Tool name]
- [1-2 sentence why this fits]

**Also consider**: [Secondary tool] (optional)
- [Brief justification]

**Sequence** (if applicable):
1. [First tool] — [what it does for this task]
2. [Second tool] — [what it does for this task]
```

**Format when nothing fits:**
```
**Assessment**: No existing tools are well-suited for [task category].

**Proposed Custom Command**: `/command-name`
- **Purpose**: [What it would do]
- **Key workflow**: [2-3 step summary]
- **Why this would help**: [Value proposition]
```

### 5. Gap Analysis (when nothing fits)
If no tools meaningfully apply:
1. Acknowledge the gap briefly (1 sentence)
2. Identify what capability would be needed
3. Propose a command or skill concept:
   - Suggested name
   - Purpose (1 sentence)
   - Key workflow (2-3 bullets)
   - Why it would help
4. Do NOT propose new MCP servers (too much implementation work)

---

## 🧭 Rules
- **Inventory before matching.** Always scan actual available tools, don't assume.
- **Prefer existing tools.** Only propose new ones if nothing existing fits.
- **Sequences over singles.** Many tasks benefit from tool combinations.
- **Be honest about gaps.** Don't force-fit tools that don't actually help.
- **Concept only for proposals.** Don't write full command implementations.

---

## ❌ When NOT to Use
- You already know exactly which command to use → just use it
- The task is trivial (typo fix, single-line change) → just do it
- You want to learn what tools exist → read `.claude/agents/README.md` directly

---

## 🎯 Primary Goal
Help users start tasks with the right tools, avoiding both tool-ignorance
(doing everything manually) and tool-overuse (using tools that don't add value).
