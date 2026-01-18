# /sequential-thinking — Structured Problem-Solving

> **MCP WRAPPER** — This is documentation only. After reading, you MUST use the MCP tool:
> → Tool: `mcp__sequential-thinking__sequentialthinking`

A reasoning tool for breaking down complex problems through flexible, revisable thinking steps.

## Features
- Adjust total thoughts as understanding deepens
- Question or revise previous thoughts
- Branch into alternative approaches
- Express uncertainty and explore options
- Generate and verify hypotheses

## When to Use
- Complex multi-step problems
- Planning that may need revision
- Analysis where scope isn't clear initially
- Tasks requiring maintained context
- Filtering irrelevant information

## Parameters
- **thought** — Current thinking step
- **thoughtNumber** — Current position in sequence
- **totalThoughts** — Estimated thoughts needed (adjustable)
- **nextThoughtNeeded** — Whether more thinking is required
- **isRevision** — Revises previous thinking
- **revisesThought** — Which thought is being reconsidered
- **branchFromThought** — Branching point for alternatives
- **branchId** — Identifier for current branch

Claude will use this tool for structured reasoning when tackling complex problems.
