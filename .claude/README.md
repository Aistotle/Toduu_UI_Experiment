# .claude/ Directory

AI tooling configuration for Claude Code and other AI assistants.

## Quick Reference

| Directory | Purpose |
|-----------|---------|
| `agents/` | Specialized subagents for delegation (explore, test, security) |
| `commands/` | Slash commands (`/commit`, `/refactor`, `/audit`, etc.) |
| `references/` | Static knowledge docs (patterns, decision trees) |
| `templates/` | Scaffolding templates for plans and projects |
| `investigations/` | Active deep-dive research sessions |
| `handoffs/` | Session continuation files for context transfer |

## Commands by Category

### Coding (`/commit`, `/refactor`, `/verify`, ...)
- `/commit` - Atomic commit hygiene
- `/commit-fix` - Surgical issue resolution
- `/commit-review` - Pre-commit change review
- `/refactor` - Safe incremental refactoring
- `/verify` - Refactoring verification
- `/simplify` - Elegant code reduction
- `/audit` - Codebase health analysis
- `/hygiene` - Codebase hygiene analysis
- `/secure` - Security vulnerability audit
- `/codacy` - Scoped static analysis
- `/analyze-codebase` - Comprehensive documentation

### Planning (`/innovate`, `/interview`, ...)
- `/innovate` - Divergent solution exploration
- `/interview` - Requirements discovery
- `/scaffold-plan` - Project plan scaffolding
- `/polish-plan` - Plan file standardization
- `/radical-simplicity` - Mindset reset

### Investigation (`/investigate-*`)
- `/investigate-create` - Start systematic investigation
- `/investigate-pickup` - Resume investigation
- `/investigate-blind-spots` - Challenge assumptions
- `/investigate-handoff` - Create handoff for next AI
- `/investigate-tidy` - Clean investigation folder
- `/investigate-final-steps` - Complete and verify

### Design (`/taste`, `/ixd`)
- `/taste` - Opinionated visual design
- `/ixd` - Expert interaction design

### MCP Tools (`/github`, `/chrome`, ...)
- `/github` - GitHub operations
- `/chrome` - Browser automation
- `/context7` - Library documentation lookup
- `/sequential-thinking` - Structured problem-solving
- `/domain-contracts` - Output validation system

### Utilities
- `/handoff` - Session continuation
- `/pickup` - Resume from handoff
- `/translate` - Translation
- `/create-command` - Command design assistant
- `/toolpick` - Tool selection advisor

## Agents

See `agents/README.md` for when to use each:
- **explore-codebase** - Fast codebase exploration
- **supabase-specialist** - Database/RLS expertise
- **security-auditor** - Vulnerability audits
- **test-generator** - Test generation
- **refactor-advisor** - Refactoring strategy

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions for AI |
| `CHRISTIAN.md` | Cognitive profile for personalization |
| `settings.json` | Permissions configuration |
| `settings.local.json` | Project-specific settings |
