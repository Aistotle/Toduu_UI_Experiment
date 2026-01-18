# Subagent Delegation Guide

This directory contains specialized subagents for parallel, focused work on specific tasks. Each agent has deep context about its domain and can work independently while you focus on implementation or other aspects.

## Quick Reference

| Agent | Model | Best For | Example Commands |
|-------|-------|----------|------------------|
| [explore-codebase](./explore-codebase.md) | Haiku | Finding code, understanding patterns | "Where is X?", "How does Y work?" |
| [supabase-specialist](./supabase-specialist.md) | Haiku | Migrations, RLS, schema design | "Write a migration for...", "Review RLS for..." |
| [security-auditor](./security-auditor.md) | Sonnet | Vulnerability audits | "Audit this API route", "Security review before PR" |
| [test-generator](./test-generator.md) | Haiku | Test generation | "Generate tests for...", "Fill coverage gaps" |

---

## When to Delegate

### explore-codebase
**Best when you need to understand existing code before implementing**

```
You: "Where is the resume import pipeline and how does it work?"
Agent: Returns file paths, line numbers, and concise explanation
You: Use this context for your implementation
```

**Typical savings**: 5-10 minutes of exploration, better implementation context

---

### supabase-specialist
**Best when working with migrations, schemas, or RLS policies**

```
You: "I need to add a 'archived' column to the resumes table with RLS"
Agent: Returns validated migration SQL with RLS policies included
You: Review and apply the migration
```

**Typical savings**: Avoids RLS mistakes, validates schema changes pre-deployment

---

### security-auditor
**Best before merging PRs or after adding API routes**

```
You: "Audit src/app/api/resumes/[id]/route.ts for security issues"
Agent: Returns JSON report with severity, location, remediation
You: Fix issues before merging
```

**Typical savings**: Catches vulnerabilities pre-production, systematic review

---

### test-generator
**Best after implementing features or when coverage drops**

```
You: "Generate Vitest tests for the resume builder component"
Agent: Returns complete test file with happy path + error cases
You: Paste into your codebase
```

**Typical savings**: 20-30 minutes of test writing, consistent patterns

---

## How to Invoke Agents

### Option 1: Explicit Delegation (Recommended)
Use the Task tool in Claude Code:

```
I need to explore where the Zustand store is used.
Use the Task tool with subagent_type=Explore
```

### Option 2: Natural Request
Simply mention in your request which agent would help:

```
"Where is the resume import logic? (use explore-codebase)"
```

### Option 3: Let Main Claude Decide
If you mention the task type, Claude Code may automatically delegate:

```
"I need to write a migration for the jobs table"
→ Claude may invoke supabase-specialist automatically
```

---

## Cost-Benefit Quick Calculation

### When Agents Provide Real Value
✅ **Invoke agents for**:
- Complex exploration (5+ minute search expected)
- Security-critical code (migrations, auth, RLS)
- Test generation (20+ test cases needed)
- PR reviews before merging

### When Main Claude is Sufficient
❌ **Don't invoke agents for**:
- Single file edits you understand
- Simple bug fixes
- Quick syntax lookups
- Minor refactoring

---

## Agent Capabilities

### explore-codebase
- Parallel search using Glob + Grep
- Returns file paths with line numbers
- Identifies patterns and related files
- **Cost**: ~0.1-0.2 cents per invocation

### supabase-specialist
- Writes complete migration SQL
- Validates RLS policies
- Checks existing schema
- **Cost**: ~0.5-1 cent per invocation

### security-auditor
- Comprehensive vulnerability analysis
- Severity-rated findings
- Actionable remediation steps
- **Cost**: ~2-3 cents per invocation

### test-generator
- Complete test files (ready to paste)
- Follows project conventions
- Covers happy path + error cases
- **Cost**: ~0.5-1 cent per invocation

---

## Examples

### Example 1: Understanding a Complex Feature
```
Task: "I need to add email notifications to the job tracker"
Decision: Use explore-codebase to find how emails are currently sent
Result: 2-minute context instead of 10-minute codebase search
Invocation: Task(subagent_type="Explore", prompt="How are emails sent in this app?")
```

### Example 2: Safe Database Changes
```
Task: "Add a 'status' column to jobs table with proper RLS"
Decision: Use supabase-specialist to write validated migration
Result: Correct RLS policies included, no security gaps
Invocation: Task(subagent_type="supabase-specialist", prompt="Add status column...")
```

### Example 3: Pre-PR Security Check
```
Task: "Implement new API endpoint for user settings"
Decision: After implementation, use security-auditor before PR
Result: Catches missing auth check, CSRF validation issue, PII leak
Invocation: Task(subagent_type="security-auditor", prompt="Audit src/app/api/account/settings/route.ts")
```

### Example 4: Test Coverage
```
Task: "New resume export feature is complete"
Decision: Use test-generator to fill coverage gaps
Result: Complete test suite in 5 minutes vs 30 minutes manual
Invocation: Task(subagent_type="test-generator", prompt="Generate tests for resume export...")
```

---

## Performance & Cost Summary

| Scenario | Main Claude Only | With Agents | Savings |
|----------|-----------------|------------|---------|
| Explore complex codebase | 10 min + tokens | 2 min + fewer tokens | 80% faster |
| Write safe migration | 15 min + think time | 5 min + validated SQL | 67% faster |
| Security audit (PR) | 20 min + risk of miss | 10 min + comprehensive | Catches issues |
| Generate tests (feature) | 30 min + boilerplate | 10 min + consistent | 67% faster |

---

## Tips for Best Results

1. **Be specific** - "Where is X?" not "Tell me about the codebase"
2. **Provide context** - "I need to add feature X which requires Y"
3. **Review output** - Agents are fast but may need adjustments
4. **Check for false positives** - Especially in security audits
5. **Combine agents** - Use explore-codebase first, then delegate implementation

---

## Feedback & Tuning

If an agent's output isn't helpful:
- Check if you need to be more specific
- Verify you're using the right agent for the task
- Report patterns in `.claude/agents/README.md`

If an agent is too expensive for the task:
- Use main Claude for simple tasks
- Reserve agents for complex/risky work
- Monitor token usage in `.claude/settings.local.json`
