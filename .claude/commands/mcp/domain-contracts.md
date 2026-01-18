# /domain-contracts — Output Validation System

> **MCP WRAPPER** — This is documentation only. After reading, you MUST use the MCP tools:
> → Tools: `mcp__domain-contracts__contract_draft`, `mcp__domain-contracts__contract_score`, `mcp__domain-contracts__contract_gate`

Define constraints and validate outputs against them using three-layer scoring.

## Tools

**contract_draft**
Transform natural language intent into a structured YAML contract with:
- Explicit constraints and success tests
- Typed test definitions
- Epsilon thresholds for tolerance
- Boundary behavior specifications

**contract_score**
Evaluate output against a contract using three layers:
1. **Deterministic** — regex, json_schema, contains, count checks
2. **Heuristic** — pattern detection, structure analysis
3. **LLM Rubric** — subjective quality dimensions

**contract_gate**
Make accept/sculpt/abstain decisions using two-stage gating:
1. **Epsilon Gate** — Does output meet contract terms?
2. **Quality Gate** — Is output good enough?

## When to Use
- Defining clear success criteria for tasks
- Validating AI-generated outputs
- Quality control before accepting results
- Iterative refinement loops

## Domain Types
- `code` — Code generation/modification
- `design` — Design work
- `writing` — Written content
- `analysis` — Analytical tasks
- `general` — Other tasks

Claude will use these tools when you need rigorous output validation.
