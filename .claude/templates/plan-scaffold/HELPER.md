# Helper — [Project Name]

Short, practical reference for AI agents working on this plan. Keep it minimal and action-oriented.

---

## Quick References

| Document | Path |
|----------|------|
| Source of truth | `[plan-path]/what_and_why.md` (Part 2) |
| Batch files | `[plan-path]/batches/` |
| Glossary | `[plan-path]/glossary.md` |

---

## Manual Testing

Use Chrome DevTools MCP for manual testing:

1. Start dev server: `pnpm dev` (port 3002)
2. Navigate to the relevant page
3. Log in with the QA user (see below)
4. Use `mcp__chrome-devtools__take_snapshot` for DOM inspection
5. Use `mcp__chrome-devtools__upload_file` for file uploads

---

## QA Test User

| Field | Value |
|-------|-------|
| Email | `qa.user01@obedai.dev` |
| Password | `QAtest_12345!` |

---

## Common Commands

```bash
# Verify changes (run after every batch)
pnpm typecheck && pnpm lint && pnpm test

# Start dev server
pnpm dev

# Run specific tests
pnpm test [test-file-pattern]
```

---

## Troubleshooting: Dev Server + Chrome DevTools MCP

**Symptoms:**
- `navigate_page` times out
- `take_snapshot` returns empty/minimal results
- Chrome shows `chrome-error://chromewebdata/`
- `curl localhost:3002` hangs

**Likely cause:** Zombie dev server process holding port 3002

**Fix:**
```bash
# 1. Kill ALL dev server processes
pkill -f "next dev"
pkill -f "node.*3002"

# 2. Verify port is free
lsof -i :3002  # Should return nothing

# 3. Start fresh dev server
pnpm dev
```

Wait for "Ready in Xms" before using Chrome DevTools MCP.

---

## Supabase

**Project ref:** `wmagubzrlaqhppuuihns`

Use `.env.supabase` for Supabase CLI context. Do not paste secrets into docs.

**MCP tools available:**
- `mcp__supabase__execute_sql` — Run SQL queries
- `mcp__supabase__list_tables` — List database tables
- `mcp__supabase__apply_migration` — Apply migrations
- `mcp__supabase__get_advisors` — Get RLS advisors

---

## Common Gotchas

| Issue | Solution |
|-------|----------|
| [Common issue 1] | [Solution] |
| [Common issue 2] | [Solution] |
