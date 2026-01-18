# /ultrathink — Multi-Agent Deep Analysis

> **PLUGIN WRAPPER** — This is documentation only. After reading, you MUST activate the plugin:
> → Run: `/ultrathink:ultrathink`

Launch a Coordinator Agent that orchestrates four specialist sub-agents to analyze, design, implement, and validate complex tasks.

## Sub-Agents
- **Architect** — Designs implementation strategy
- **Research** — Gathers context and explores codebase
- **Coder** — Implements the solution
- **Tester** — Validates the implementation

## When to Use
- Complex, multi-step tasks that benefit from structured thinking
- Tasks where you want multiple perspectives before implementation
- Large features or refactors that need careful planning

## Usage
Invoke the plugin: `/ultrathink:ultrathink`

Pass the task description directly:
```
/ultrathink:ultrathink <TASK_DESCRIPTION>
```

Reference files with `@filename` syntax for additional context.

---

*Wrapper for plugin:ultrathink@claude-code-marketplace*
