# /context7 — Library Documentation Lookup

> **MCP WRAPPER** — This is documentation only. After reading, you MUST use the MCP tools:
> → Tools: `mcp__plugin_context7_context7__resolve-library-id`, `mcp__plugin_context7_context7__query-docs`

Fetch up-to-date documentation and code examples for any programming library or framework.

## Tools
- **resolve-library-id** — Find the Context7 library ID for a package name
- **query-docs** — Query documentation for a specific library

## When to Use
- Need current docs for React, Next.js, Supabase, etc.
- Looking for code examples and API references
- Want accurate, up-to-date library information

## Usage
First resolve the library ID, then query:
```
1. resolve-library-id: libraryName="react", query="hooks useState"
2. query-docs: libraryId="/facebook/react", query="useState examples"
```

Claude will use these tools automatically when you ask about library documentation.
