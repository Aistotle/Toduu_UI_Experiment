# /secure — Security Vulnerability Audit

Find security vulnerabilities before they ship. Outputs prioritized findings to `tasks/security-[date].md`.

---

## 🧠 Purpose

Force adversarial thinking: "How could this be exploited?" instead of "Does this work?"

This command systematically scans for OWASP Top 10 vulnerabilities using patterns specific to this codebase (Next.js 15 + Supabase handling sensitive resume/career data).

---

## 🎯 When to Use

- Before merging PRs that touch API routes, auth, or data handling
- After adding new endpoints or Supabase queries
- Periodic security sweeps (monthly)
- When touching: `src/app/api/`, `src/lib/auth/`, `supabase/migrations/`

---

## 🛠️ Execution Steps

### 1. Scope Definition

**If `$ARGUMENTS` provided**: Audit those specific files/directories.
**If no arguments**: Ask what to audit:

```
What should I audit?
1. Recent changes (git diff against main)
2. All API routes (src/app/api/**/*)
3. Auth & security layer (src/lib/auth/, src/middleware.ts)
4. Full codebase sweep
5. Specific files: [user specifies]
```

### 2. Security Context Check

Before scanning, verify these project safeguards exist:

| Safeguard | Location | Check |
|-----------|----------|-------|
| CSRF tokens | `@/lib/api/secureFetch` | Used in client API calls |
| Rate limiting | `src/middleware.ts` | Upstash configured |
| PII redaction | `@/lib/redact` | Used in logging |
| Auth guards | `@/lib/auth/server` | `requireUser()` in protected routes |
| Security headers | `src/middleware.ts` | CSP, HSTS present |
| RLS policies | `supabase/migrations/*.sql` | All tables have policies |

Flag any missing safeguards as **CRITICAL** findings.

### 3. OWASP Top 10 Scan

Systematically check each category against scoped files:

#### A01: Broken Access Control
- [ ] API routes missing `requireUser()`
- [ ] IDOR: User IDs from request used without ownership check
- [ ] Missing org membership verification (`user.org_id` checks)
- [ ] RLS policies missing or permissive (`USING (true)`)

#### A02: Cryptographic Failures
- [ ] Sensitive data in logs (check `console.log`, `logger.*` calls)
- [ ] PII in API responses that shouldn't include it
- [ ] Unencrypted storage of sensitive fields
- [ ] Secrets in code (API keys, passwords)

#### A03: Injection
- [ ] SQL: Raw queries with string interpolation (Supabase `.rpc()` with user input)
- [ ] XSS: `dangerouslySetInnerHTML`, unescaped user input in JSX
- [ ] Command: `child_process.exec()`, `spawn()` with user input
- [ ] Template: String interpolation in SQL/shell commands

#### A05: Security Misconfiguration
- [ ] `AUTH_BYPASS` enabled outside dev
- [ ] Permissive CORS (`Access-Control-Allow-Origin: *`)
- [ ] Missing security headers
- [ ] Debug/verbose error messages in production
- [ ] Default credentials or secrets

#### A07: Identification & Authentication Failures
- [ ] Session fixation (session ID unchanged after login)
- [ ] Weak password requirements
- [ ] Missing rate limiting on auth endpoints
- [ ] Auth bypass in dev mode reaching production

#### A08: Software & Data Integrity Failures
- [ ] Missing input validation on API routes
- [ ] Unchecked file uploads
- [ ] Unverified redirects

#### A09: Security Logging & Monitoring Failures
- [ ] Auth events not logged
- [ ] Failed access attempts not tracked
- [ ] PII in logs (inverse: should be redacted)

### 4. Project-Specific Patterns

Check for correct usage of this project's security patterns:

```typescript
// ✅ CORRECT: Protected API route
import { requireUser } from '@/lib/auth/server'
export async function POST(req: Request) {
  const user = await requireUser()  // Throws if not authenticated
  // ...
}

// ❌ WRONG: Unprotected API route
export async function POST(req: Request) {
  const { userId } = await req.json()  // IDOR vulnerability
  // ...
}
```

```typescript
// ✅ CORRECT: Client API call with CSRF
import { secureFetch } from '@/lib/api/secureFetch'
await secureFetch('/api/data', { method: 'POST', body })

// ❌ WRONG: Raw fetch without CSRF
await fetch('/api/data', { method: 'POST', body })
```

```sql
-- ✅ CORRECT: RLS policy with ownership check
CREATE POLICY "Users can only see own data" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

-- ❌ WRONG: Permissive RLS
CREATE POLICY "Allow all" ON resumes
  FOR ALL USING (true);
```

### 5. Generate Findings Report

Output to `tasks/security-YYYY-MM-DD.md`:

```markdown
# Security Audit — YYYY-MM-DD

## Scope
[Files/areas audited]

## Summary
| Severity | Count |
|----------|-------|
| CRITICAL | X |
| HIGH | X |
| MEDIUM | X |
| LOW | X |

## Findings

### CRITICAL

#### [TITLE]
- **File**: `path/to/file.ts:42`
- **Category**: A01 Broken Access Control
- **Issue**: [Description]
- **Code**:
  ```typescript
  [vulnerable code snippet]
  ```
- **Remediation**: [Specific fix]
- **Confidence**: high | medium | low
- **Reference**: [OWASP link]

### HIGH
[...]

### MEDIUM
[...]

### LOW
[...]

## Safeguards Status
| Safeguard | Status |
|-----------|--------|
| CSRF tokens | ✅ |
| Rate limiting | ✅ |
| ... | ... |
```

Also output machine-readable JSON:

```json
{
  "audit_date": "YYYY-MM-DD",
  "scope": ["src/app/api/**"],
  "summary": { "critical": 0, "high": 1, "medium": 2, "low": 0 },
  "findings": [
    {
      "severity": "high",
      "category": "A03",
      "title": "SQL Injection via user input",
      "file": "src/app/api/search/route.ts",
      "line": 42,
      "issue": "User input directly interpolated into RPC call",
      "code_snippet": "await supabase.rpc(`search_${userInput}`)",
      "remediation": "Use parameterized queries",
      "confidence": "high",
      "reference": "https://owasp.org/Top10/A03_2021-Injection/"
    }
  ]
}
```

---

## Severity Levels

| Level | Definition | Examples |
|-------|------------|----------|
| **CRITICAL** | Exploitable now, high impact | Auth bypass, RCE, missing RLS |
| **HIGH** | Serious vulnerability | SQL injection, XSS, data leak |
| **MEDIUM** | Moderate risk | Missing validation, weak patterns |
| **LOW** | Best practice violation | Minor improvements |

---

## 🧭 Rules

1. **Read-only** — Never modify code; report findings only
2. **Specific locations** — Include file paths and line numbers
3. **Actionable remediation** — Each finding must have a fix
4. **Confidence levels** — Flag uncertain findings as `"confidence": "low"`
5. **Project patterns first** — Check for correct usage of `requireUser`, `secureFetch`, RLS
6. **Dev code in prod** — Flag any `AUTH_BYPASS`, debug modes, or dev-only code

---

## ❌ Anti-Patterns

Reject impulses to:
- Skip categories because "we probably don't have that issue"
- Report without remediation steps
- Miss IDOR because it's subtle (always check ownership verification)
- Ignore RLS policies (they're the last line of defense)
- Assume `requireUser()` is enough (also need ownership checks)

---

## ❌ When NOT to Use

- Fixing a known vulnerability → just fix it
- Code health/complexity audit → use `/audit`
- Quick typo or style fix → just do it
- Understanding code structure → use Explore agent

---

## 🔗 Integration

Consider adding to PR workflow:
```bash
# In PR template or CI
claude "/secure src/app/api/ src/lib/auth/"
```

Pairs with:
- `/audit` — Code health (run monthly together)
- `/verify` — After fixing findings, verify the fix

---

## 🎯 Primary Goal

Produce a prioritized, actionable security report that catches vulnerabilities before they reach production—especially the subtle ones (IDOR, auth bypass) that manual review misses.
